import { Octokit } from 'octokit';
import jwt from 'jsonwebtoken';
import { writeFileSync, mkdir } from 'node:fs';
// import { chatCompletion } from '../services/openaiService.js';
import { ghService } from '../services/githubService.js';

// set this to false if you dont want to write said data to files. (we're only doing this with our own data, during development.)
const writeFSUserCommitsToRepoBool = true;
const writeFSUserDataMegaBool = true;

// leave this false for now, until more progress is made on this.
// an error will be returned right now anyway, as calling openai requires specific org, project, and api keys in one's .env file.
const sendToOpenAIBool = false;

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo) => {
  const {method, type, err} = errInfo;
  return {
    log: `githubController.${method} ${type}: ERROR: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: {err: `Error occurred in githubController.${method}. Check server logs for more details.`}
  }
}

const githubController = {};

// create an instance of octokit (octokit is used to interact with the GitHub REST API in JS scripts)
githubController.connectOctokit = (req, res, next) => {
  // check for missing data
  // console.log('CONNECT OCTOKIT: TOKEN:   ', req.user.token);
  // if (!req.user.token) return next(createErr({
  //   method: 'connectOctokit',
  //   type: 'receiving token data',
  //   err: 'Invalid data received'
  // }));

  const octokit = new Octokit({
    auth: req.user.token
  });
  res.locals.octokit = octokit;
  next();
};

// gets the list of all commits for a particular repo for a particular author
githubController.getCommits = async (req, res, next) => {
  const { owner, repoName } = req.body;

  console.log('GET COMMITS: owner', owner, 'repoName', repoName);

  // check for missing data
  if (!owner || !repoName) return next(createErr({
    method: 'getCommits',
    type: 'receiving owner and repoName data',
    err: 'Invalid data received'
  }));

  // helper function to retrieve code details for a specified commit
  const getCommitCode = async (owner, repoName, commitSha) => {
    try {
      const gitCommitDiffs = await res.locals.octokit.request(`GET /repos/${owner}/${repoName}/commits/${commitSha}`, {
        owner: owner,
        repo: repoName,
        ref: commitSha,
        headers: {
          "content-type": 'application/vnd.github.diff',
          "Accept": 'application/vnd.github+json'
        }
      });
      return gitCommitDiffs.data.files.map(file => ({
        filename: file.filename,
        patch: file.patch
      }));
    } catch (err) {
      return next(createErr({
        method: 'getCommits',
        type: 'requesting commit diffs data to GitHub API',
        err
      }));
    };
  };

  const result = [];

  // gets the list of all commits from GitHub, this is essentially metadata about commits and doesn't include code details
  try {
    const gitCommits = await res.locals.octokit.request(`GET /repos/${owner}/${repoName}/commits`, {
      owner: owner,
      repo: repoName,
      // without 'author' parameter this request returns all commits for this repo
      author: owner,
      headers: { "Accept": 'application/vnd.github+json' }
    });

    // remove all commit messages starting from "Merge", as these are automatic merge commits
    const validCommits = gitCommits.data.filter(cmt => !cmt.commit.message.includes("Merge", 0));
    const mergeCommits = gitCommits.data.filter(cmt => cmt.commit.message.includes("Merge", 0));

    console.log('githubController: mergeCommits.length:', mergeCommits.length);

    const commitPromises = validCommits.map(async cmt => {
      // Step 1. getCommitCode is an async func, so it returns a Promise #1
      // Step 4. eventually we return Promise #2 to the mapped array
      return await getCommitCode(owner, repoName, cmt.sha)
        // Step 2. the Promise #1 returned from getCommitCode resolves with an array of file objects
        .then(files => {
          // Step 3. .then returns another Promise #2 which - when resolved - returns a modified object containing all information about the requested commit
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha, // KG: I propose renaming this to 'sha'.
            files,
            shaShort: cmt.sha.slice(0, 7),
          }
        })
        // not using global error handling here. Even if 1 commit request errors out, it returns a valid object which will be wrapped in Promise. Hence, Promise.all never resolved with reject, if requests for commit details partially fail.
        .catch(err => {
          console.error(`Failed to get commit code for commit ${cmt.sha}: ${err}`);
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha,
            files: [],
            shaShort: cmt.sha.slice(0, 7),
            error: 'Failed to retrieve commit details'
          }
        });
    });

    const mergePromises = mergeCommits.map(async cmt => {
      // Step 1. getCommitCode is an async func, so it returns a Promise #1
      // Step 4. eventually we return Promise #2 to the mapped array
      return await getCommitCode(owner, repoName, cmt.sha)
        // Step 2. the Promise #1 returned from getCommitCode resolves with an array of file objects
        .then(files => {
          // Step 3. .then returns another Promise #2 which - when resolved - returns a modified object containing all information about the requested commit
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha,
            files,
            shaShort: cmt.sha.slice(0, 7),
          }
        })
        // not using global error handling here. Even if 1 commit request errors out, it returns a valid object which will be wrapped in Promise. Hence, Promise.all never resolved with reject, if requests for commit details partially fail.
        .catch(err => {
          console.error(`Failed to get commit code for commit ${cmt.sha}: ${err}`);
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha,
            files: [],
            shaShort: cmt.sha.slice(0, 7),
            error: 'Failed to retrieve commit details'
          }
        });
    });

    // Promise.all allows to process async requests for commit details in parallel, which helps to reduce time of processing for a large number of commits
    const commits = await Promise.all(commitPromises);
    res.locals.commits = commits;
    // res.locals.ghData.commits = commits;

    const merges = await Promise.all(mergePromises);
    res.locals.userDataMega = merges;
    res.locals.commits = commits;

    if (writeFSUserCommitsToRepoBool){
      mkdir((new URL('../../data/commits', import.meta.url)), { recursive: true }, (err) => {
        if (err) throw err;
      });
      writeFileSync(`./data/commits/${owner}_${repoName}_commits.json`, JSON.stringify(commits, null, 2));
      writeFileSync(`./data/commits/${owner}_${repoName}_merges.json`, JSON.stringify(merges, null, 2));

    }

    if (sendToOpenAIBool){
      const openaiCommits0Completion = await chatCompletion(owner, repoName, commits[0].commitSha, commits[0].files);

      writeFileSync(`./data/commits/${owner}_${repoName}_commits0_openai_bulletPoints.json`, JSON.stringify(openaiCommits0Completion, null, 2));
    }

    next();
  } catch (err) {
      return next(createErr({
        method: 'getCommits',
        type: 'requesting commits data to GitHub API',
        err
      }));
  };
};

githubController.getUserDataMega = async (req, res, next) => {
  const { token, username } = req.user;

  const response = await ghService.getUserDataMega(token, username);
  console.log(response ? 'getUserDataMega: ✅' : 'getUserDataMega: ❌');

  // res.locals.userDataMega = response;
  next();
}

githubController.getOrgs = async (req, res, next) => {
  const { token } = req.user;
  const response = await ghService.getOrgs(token);
  console.log(response ? 'getOrgs: ✅' : 'getOrgs: ❌');
  res.locals.orgs = response;
  next();
}

githubController.getEventsReceived = async (req, res, next) => {
  const { token, username } = req.user;

  const response = await ghService.getEventsReceived(token, username);
  console.log(response ? 'getEventsReceived: ✅' : 'getEventsReceived: ❌');

  res.locals.eventsReceived = response;
  next();
}

githubController.getPRs = async (req, res, next) => {
  const { token, username, repoName } = req.user;
  const { eventsReceived } = res.locals;
  // console.log('githubController: getPRs: token', token, 'username', username, 'repoName', repoName);
  const response = await ghService.getPRs(token, username, eventsReceived);
  console.log(response ? 'getPRs: ✅' : 'getPRs: ❌');
  res.locals.PRs = response;
  next();
}

export { githubController };
