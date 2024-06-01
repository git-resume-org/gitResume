import express from 'express';
import { githubController } from '../controllers/githubController.js';

const githubRouter = express.Router();

githubRouter.post('/commits', githubController.connectOctokit, githubController.getCommits, (req, res) => {
    res.status(200).json(res.locals.commits);
});

export { githubRouter };