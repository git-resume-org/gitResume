import axios from 'axios';
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
  // console.log('ghService: fetchData: url', url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('githubService, fetchData: Failed to fetch user information:', error);
    throw new Error('githubService, fetchData: Failed to fetch user information');
  }
}

const writeData = async (fileName, data, subfolder = 'user') => {
  if (!writeFSUserDataMegaBool) return;
  mkdir((new URL(`../../data/${subfolder}`, import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });
  writeFileSync(`./data/${subfolder}/${fileName}`, JSON.stringify(data, null, 2));
}

ghService.getUserDataMeta = async (token) => {

  // console.log('authC: getUserDataMeta: token', token);
  const url = 'https://api.github.com/user';
  const userData = await fetchData(token, url);

  writeData('userDataMeta', userData);
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
      // console.log('authC: fetchData: url', url);
      // console.log('githubService: getUserDataMega:', key, value);

      const userDataMega = await fetchData(token, url);
      userDataMegaDx[key] = userDataMega;

      if (/repos[AB]/.test(key)) {
        // console.log('githubService: key', key);
        writeData(`${key}.json`, userDataMega);
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

  // writeFileSync(`./data/user/repos`, JSON.stringify(userDataMegaDx[`repos`], null, 2));
  writeData('repos', userDataMegaDx['repos'], )

  // writeFileSync(`./data/user/megadata`, JSON.stringify(userDataMegaDx, null, 2));
  writeData('megadata', userDataMegaDx);
  return true;
};

ghService.getOrgs = async (token) => {
  // console.log('ghService: getOrgs: token', token);
  const url = `https://api.github.com/user/orgs`;
  const orgs = await fetchData(token, url);
  // writeFileSync(`./data/user/orgs`, JSON.stringify(orgs, null, 2));
  writeData('orgs', orgs);
  return orgs;
}

ghService.getEventsReceived = async (token, username) => {
  const url = `https://api.github.com/users/${username}/${ghApiEndpoints.received_events}`;
  const events = await fetchData(token, url);
  return events;
}

ghService.getPRs = async (token, username, eventsReceived) => {

  const prs = {};
  const prUrls = []

  // map to create an array of promises and then await Promise.all
  const prPromises = eventsReceived.map(async (event) => {
    if (event.type === 'PullRequestEvent' && event.payload.pull_request.user.login === username) {
      // console.log('ghService: getPRs: event', event);
      const full_name = event.payload.pull_request.base.repo.full_name
      // console.log('ghService: getPRs: full_name', full_name);
      const fullNameNoSlash = full_name.replace('/', '_');
      const prNum = event.payload.number;
      const key = `${fullNameNoSlash}_${prNum}`;

      const prUrl = `https://github.com/${full_name}/pull/${prNum}.patch`;

      const responseText = await fetchData(token, prUrl);

      prs[key] = responseText;

      const prFileName = `${key}.patch`;
      const prsFilePath = `./data/prs/${prFileName}`;

      // writeFileSync(prsFilePath, prs[key], null, 2);
      writeData(prFileName, prs[key], 'prs');
      const patch = fs.readFileSync(prsFilePath, 'utf-8');
      const parsedPatch = parseGitPatch(patch);
      // const parsedPatch = parseGitPatchFork(patch);

      const jsonFilePath = path.join('./data/prs', `${key}.json`);
      // fs.writeFileSync(jsonFilePath, JSON.stringify(parsedPatch, null, 2));
      writeData(`${key}.json`, parsedPatch, 'prs');
    }
  });

  // TODO:
  //   - regex to delete everything from and including the following until the next appearance of 'diff':
  // 'diff --git a/package-lock.json'
  // 'diff --git a/.gitignore b/.gitignore'

  // Wait for all promises to resolve
  await Promise.all(prPromises);

  // writeFileSync(`./data/user/prs`, JSON.stringify(prs, null, 2));

  writeData(`all_${new Date().toISOString()}`, prs, 'prs');

  return prs;

}

export { ghService };
