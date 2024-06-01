import { Octokit } from 'octokit';

const githubController = {};

// create an instance of octokit (octokit is used to interact with the GitHub REST API in JS scripts)
githubController.connectOctokit = (req, res, next) => {
    // TO-DO: error handling if accessToken does not exist
    const octokit = new Octokit({
        auth: req.session.accessToken
    });
    res.locals.octokit = octokit;
    next();
};

// gets the list of all commits for a particular repo for a particular author
githubController.getCommits = async (req, res, next) => {
    const { owner, repoName } = req.body;
    // TO-DO: error handling if owner/repoName does not exist
    // TO-DO: error handling if bad response from github

    const getCommitCode = async (owner, repoName, commitSha) => {
        const gitCommitDiffs = await res.locals.octokit.request(`GET /repos/${owner}/${repoName}/commits/${commitSha}`, {
            owner: 'OWNER',
            repo: 'REPO',
            ref: 'REF',
            headers: {
                "content-type": 'application/vnd.github.diff',
                "Accept": 'application/vnd.github+json' 
            }
        });

        return gitCommitDiffs.data.files.map(file => ({
            filename: file.filename,
            patch: file.patch
        }));
    };

    const result = [];

    const gitCommits = await res.locals.octokit.request(`GET /repos/${owner}/${repoName}/commits`, {
        owner: owner,
        repo: repoName,
        // without 'author' parameter this request returns all commits for this repo
        author: owner,
        headers: { "Accept": 'application/vnd.github+json' }
    });
    // remove all commit messages starting from "Merge", as these are automatic merge commits
    const validCommits = gitCommits.data.filter(cmt => !cmt.commit.message.includes("Merge", 0));

    for (let cmt of validCommits) {
        const files = await getCommitCode(owner, repoName, cmt.sha);
        result.push({
            author: owner,
            date: cmt.commit.author.date,
            message: cmt.commit.message,
            commitSha: cmt.sha,
            files
        });
    }
    res.locals.commits = result;

    next();
};

export { githubController };