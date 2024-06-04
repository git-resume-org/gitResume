import express from 'express';
import { githubController } from '../controllers/githubController.js';
import { authController } from '../controllers/authController.js';

const githubRouter = express.Router();

// accepts owner and repoName and gets commit history data (messages and patches of code)
githubRouter.post('/commits', 
  authController.verify,
  githubController.connectOctokit, 
  githubController.getCommits, 
  (req, res) => res.status(200).json(res.locals.commits));

export { githubRouter };