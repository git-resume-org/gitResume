import fetch from 'node-fetch';
import { writeFileSync, mkdir, readFileSync } from 'node:fs';

import fs from 'fs';
import path from 'path';

// had to import parseGitPatch as a CJS module to get it to work.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const parseGitPatch = require('parse-git-patch').default;
// const parseGitPatchFork = require('parse-git-patch-fork').default;

// set this to false if you dont want to write said data to files. (we're only doing this with our own data.)
const writeFSUserDataMegaBool = true;

const ghService = {};

const ghApiEndpoints = {
  subscriptions: 'subscriptions',
  received_events: 'received_events',
  events: 'events',
  orgs: `orgs`,
  reposA: `repos`,
  reposB: `repos`,
};

const fetchData = async (token, url) => {
  console.log('ghService: fetchData: url', url);
  // console.log('fetch', fetch);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  return response;

}

ghService.getUserDataMeta = async (token) => {

  // console.log('authC: getUserDataMeta: token', token);
  const url = 'https://api.github.com/user';
  const response = await fetchData(token, url);

  const userData = await response.json();
  // recursive = true: if the folder already exists, it doesn't throw an error
  mkdir((new URL('../../data/user', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  writeFileSync(`./data/user/metadata`, JSON.stringify(userData, null, 2));
  // console.log('authC: getUserInfo: userData', userData);
  return userData;
}

ghService.getUserDataMega = async (token, username) => {
  const userDataMegaDx = {}

  for (let [key, value] of Object.entries(ghApiEndpoints)) {
    try {
      let url = `https://api.github.com/users/${username}/${value}`
      if (key === 'reposB') {
        url = `https://api.github.com/search/repositories?q=user:${username}`
      }
      console.log('authC: fetchData: url', url);
      console.log('githubService: getUserDataMega:', key, value);
      const userDataMega = await fetchData(token, url);

      userDataMegaDx[key] = userDataMega;
      if (writeFSUserDataMegaBool && /repos[AB]/.test(key)) {
        console.log('githubService: key', key);
        writeFileSync(`./data/user/${key}`, JSON.stringify(userDataMega, null, 2));
      }

    } catch (err) {
      console.log(err);
    }
  }

  const reposA = userDataMegaDx['reposA'];
  const reposB = userDataMegaDx['reposB'];
  if (reposA && reposB) {
    userDataMegaDx['repos'] = [...reposA, ...reposB.items];
    delete userDataMegaDx['reposA'];
    delete userDataMegaDx['reposB'];
  }

  // remove duplicate repos
  const uniqueRepos = userDataMegaDx['repos'].reduce((acc, repo) => {
    const existingRepo = acc.find(r => r.id === repo.id);
    if (!existingRepo) {
      acc.push(repo);
    }
    return acc;
  }, []);
  userDataMegaDx['repos'] = uniqueRepos;

  writeFileSync(`./data/user/repos`, JSON.stringify(userDataMegaDx[`repos`], null, 2));

  writeFileSync(`./data/user/megadata`, JSON.stringify(userDataMegaDx, null, 2));
  return true;
};

ghService.getOrgs = async (token) => {
  const url = `https://api.github.com/user/orgs`;
  const response = await fetchData(token, url);

  const orgs = await response.json();
  // recursive = true: if the folder already exists, it doesn't throw an error
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  writeFileSync(`./data/user/orgs`, JSON.stringify(orgs, null, 2));

  return orgs;
}

ghService.getEventsReceived = async (token, username) => {
  const url = `https://api.github.com/users/${username}/${ghApiEndpoints.received_events}`;

  const response = await fetchData(token, url);
  const events = await response.json();

  return events;
}

ghService.getPRs = async (token, username, eventsReceived) => {
  mkdir((new URL('../../data/prs/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  const prs = {};
  const prUrls = []

  // Use map to create an array of promises and then await Promise.all
  const prPromises = eventsReceived.map(async (event) => {
    if (event.type === 'PullRequestEvent' && event.payload.pull_request.user.login === username) {
      // console.log('ghService: getPRs: event', event);
      const full_name = event.payload.pull_request.base.repo.full_name
      console.log('ghService: getPRs: full_name', full_name);
      const prNum = event.payload.number;
      const prUrl = `https://github.com/${full_name}/pull/${prNum}.patch`;

      const response = await fetchData(token, prUrl);

      const fullNameNoSlash = full_name.replace('/', '_');

      const key = `${fullNameNoSlash}_${prNum}`;

      prs[key] = await response.text();

      const prsFilePath = `./data/prs/${key}.patch`;

      writeFileSync(prsFilePath, prs[key], null, 2);
      const patch = fs.readFileSync(prsFilePath, 'utf-8');
      const parsedPatch = parseGitPatch(patch);
      // const parsedPatch = parseGitPatchFork(patch);


      const jsonFilePath = path.join('./data/prs', `${key}.json`);
      fs.writeFileSync(jsonFilePath, JSON.stringify(parsedPatch, null, 2));
    }
  });

  // TODO:
  //   - regex to delete everything from and including the following until the next appearance of 'diff':
  // 'diff --git a/package-lock.json'
  // 'diff --git a/.gitignore b/.gitignore'


  // Wait for all promises to resolve
  await Promise.all(prPromises);

  writeFileSync(`./data/user/prs`, JSON.stringify(prs, null, 2));

  return prs;

}

export { ghService };
