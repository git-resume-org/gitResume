import { Octokit } from 'octokit';
import jwt from 'jsonwebtoken';
import { writeFileSync, mkdir } from 'node:fs';
import { minimatch } from 'minimatch';

import { ghService } from '../services/githubService.js';
// import { filterBranchesByAuthorCommits, filterReposByAuthorInOrgs } from '../services/filterGhData.js';
// new node 18 feature requires that json be imported with a type assertion
import commonlyIgnoredFiles from '../helpers/commonlyIgnoredFiles.json' assert { type: 'json' };

// set this to false if you dont want to write said data to files. (we're only doing this with our own data, during development.)
const writeFSUserCommitsToRepoBool = true;
const writeFSUserDataMegaBool = true;

// leave this false for now, until more progress is made on this.
// an error will be returned right now anyway, as calling openai requires specific org, project, and api keys in one's .env file.
const sendToOpenAIBool = false;

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo) => {
  const { method, type, err } = errInfo;
  return {
    log: `githubController.${method} ${type}: ERROR: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in githubController.${method}. Check server logs for more details.` }
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

githubController.getRepos = async (req, res, next) => {
  console.log('GETTING REPOS FOR THE AUTHORIZED USER');
  // helper function to retrieve the data where the repo was forked from ('parent')
  const getRepoDetails = async (owner, repoName) => {
    try {
      const repoDetails = await res.locals.octokit.request(`GET /repos/${owner}/${repoName}`, {
        owner: owner,
        repo: repoName,
        headers: {
          "Accept": 'application/vnd.github+json'
        }
      });
      return repoDetails.data.parent.full_name;
    } catch (err) {
      console.error(`Error requesting repo details for ${repoName}:`, err);
      return null;
    };
  };

  const getLanguageDetails = async (repoOwner, repoName) => {
    let mainLanguage;
    try {
      const languagesResponse = await res.locals.octokit.request(`GET /repos/${repoOwner}/${repoName}/languages`, {
        owner: repoOwner,
        repo: repoName
      });
      const languages = languagesResponse.data;

      if (Object.keys(languages).length) mainLanguage = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b);
      else mainLanguage = null;
      return mainLanguage;
    } catch (err) {
      console.error(`Failed to fetch languages for repo ${repoName}. error: ${err}`);
      return null;
    }
  };

  // gets the list of all repos which the authorized user owns or in which the user is a collaborator
  try {
    // const userReposFromOrgs = await filterReposByAuthorInOrgs(req.user.username, res.locals.orgNames)

    // console.log('githubController: getRepos: userReposFromOrgs', userReposFromOrgs);

    const userReposGithub = await res.locals.octokit.request('GET /user/repos', {
      affiliation: 'owner, collaborator',
      sort: 'pushed',
      // TO-DO: research what to do if request returns more than 100
      per_page: 100
    });
    // const userReposArray = userReposGithub.data;

    // console.log('githubController: getRepos: userReposFromOrgs', userReposFromOrgs.length);
    // // userReposArray.push(  );

    // console.log('githubController: getRepos: userReposArray', userReposArray.length);
    // console.log('githubController: getRepos: userReposArray', userReposArray);

    // console.log('githubController: getRepos: userReposGithub', typeof userReposGithub.data);
    // console.log('\n\n');
    const repoPromises = userReposGithub.data.map(async repo => {
      // default for non-forked repositories
      let forkedFrom = null;
      if (repo.fork) forkedFrom = await getRepoDetails(repo.owner.login, repo.name);
      // get language for repos which don't have it specified
      let language = repo.language;
      if (!repo.language) language = await getLanguageDetails(repo.owner.login, repo.name);
      return {
        id: repo.id,
        repoName: repo.name,
        private: repo.private,
        mainLang: language,
        updated: repo.updated_at,
        pushed: repo.pushed_at,
        forkedFrom,
        numberOfForks: repo.forks_count
      }
    });

    const repos = await Promise.all(repoPromises);
    res.locals.userRepos = repos;
    // console.log('githubController: getRepos: repos', repos.length);

    next();
  } catch (err) {
    return next(createErr({
      method: 'getRepos',
      type: `requesting repo list for authorized user to GitHub API`,
      err
    }));
  }
};

// gets the list of all commits for a particular repo for a particular author
githubController.getCommits = async (req, res, next) => {
  const owner = req.user.username;
  const repoName = req.body.repoName;
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
      // return gitCommitDiffs.data.files.map(file => ({
      //   filename: file.filename,
      //   patch: file.patch
      // }));
      return gitCommitDiffs.data.files
        .filter(file => {
          return !commonlyIgnoredFiles.includes(file.filename);
        })
        .map(file => ({
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
    // console.log('githubController: mergeCommits.length:', mergeCommits.length);
    let filteredFiles = []

    // console.log('githubController: commonlyIgnoredFiles.length:', commonlyIgnoredFiles.length);
    const commitPromises = validCommits.map(async cmt => {
      // Step 1. getCommitCode is an async func, so it returns a Promise #1
      // Step 4. eventually we return Promise #2 to the mapped array
      return await getCommitCode(owner, repoName, cmt.sha)
        .then(files => {
          // Filter out the files that are in commonlyIgnoredFiles
          // console.log('files.length before filtering', files.length);
          filteredFiles = files.filter(file => {
            return !commonlyIgnoredFiles.some(pattern => minimatch(file.filename, pattern));
          });

          return filteredFiles; // return the filtered files
        })
        // Step 2. the Promise #1 returned from getCommitCode resolves with an array of file objects
        .then(files => {
          // console.log('files.length after filtering', files.length);
          // console.log('filteredFiles.length', filteredFiles.length);
          // Step 3. .then returns another Promise #2 which - when resolved - returns a modified object containing all information about the requested commit
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha, // KG: I propose renaming this to 'sha'.
            // excluding frequently ignored or extremely large but not that particularly valuable files
            files: filteredFiles,
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
    let filteredMerges = []
    const mergePromises = mergeCommits.map(async cmt => {
      // Step 1. getCommitCode is an async func, so it returns a Promise #1
      // Step 4. eventually we return Promise #2 to the mapped array
      return await getCommitCode(owner, repoName, cmt.sha)
        .then(files => {
          // Filter out the files that are in commonlyIgnoredFiles
          // console.log('files.length before filtering', files.length);

          filteredMerges = files.filter(file => {
            return !commonlyIgnoredFiles.some(pattern => minimatch(file.filename, pattern));
          });

          return filteredMerges; // return the filtered files
        })
        // Step 2. the Promise #1 returned from getCommitCode resolves with an array of file objects
        .then(files => {
          // console.log('files.length after filtering', files.length);
          // console.log('filteredFiles.length', filteredFiles.length);

          // Step 3. .then returns another Promise #2 which - when resolved - returns a modified object containing all information about the requested commit
          return {
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha, // KG: I propose renaming this to 'sha'.
            // excluding frequently ignored or extremely large but not that particularly valuable files
            files: filteredMerges,
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
    const merges = await Promise.all(mergePromises); // Promise.all(mergePromises);
    res.locals.merges = merges;
    // res.locals.commits = commits;


    // console.log('githubController: commits, complete');

    if (writeFSUserCommitsToRepoBool) {
      mkdir((new URL('../../data/commits', import.meta.url)), { recursive: true }, (err) => {
        if (err) throw err;
      });
      writeFileSync(`./data/commits/${owner}_${repoName}_commits_${new Date().toISOString()}.json`, JSON.stringify(commits, null, 2));
      writeFileSync(`./data/commits/${owner}_${repoName}_merges_${new Date().toISOString()}.json`, JSON.stringify(merges, null, 2));

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
  // console.log('githubController:', response ? 'getUserDataMega: ✅' : 'getUserDataMega: ❌');

  res.locals.userDataMega = response;
  next();
}

githubController.getOrgs = async (req, res, next) => {
  const { token } = req.user;

  const response = await ghService.getOrgs(token);
  // console.log('githubController:', response ? 'getOrgs: ✅' : 'getOrgs: ❌');

  // console.log('githubController.getOrgs:', response);

  const orgNames = await response.map(org => org.login);

  res.locals.orgs = response;
  res.locals.orgNames = orgNames;

  next();
}

githubController.getEventsReceived = async (req, res, next) => {
  const { token, username } = req.user;

  const response = await ghService.getEventsReceived(token, username);
  // console.log('githubController:', response ? 'getEventsReceived: ✅' : 'getEventsReceived: ❌');

  res.locals.eventsReceived = response;
  next();
}

githubController.getPRs = async (req, res, next) => {
  const { token, username, repoName } = req.user;
  const { eventsReceived } = res.locals;

  const response = await ghService.getPRs(token, username, eventsReceived);
  // console.log('githubController:', response ? 'getPRs: ✅' : 'getPRs: ❌');

  res.locals.PRs = response;
  next();
}

githubController.getCommitsByBranch = async (req, res, next) => {
  const { owner, author, repoName } = req.body;
  // console.log('githubController.getCommitsByBranch: START');
  // console.log('githubController.getCommitsByBranch: req.user', req.body);

  const response = await filterBranchesByAuthorCommits(owner, author, repoName);
  // console.log('githubController:', response ? 'getCommitsByBranch: ✅' : 'getCommitsByBranch: ❌');
  res.locals.commitsByBranch = response;
  next();

}



export { githubController };
