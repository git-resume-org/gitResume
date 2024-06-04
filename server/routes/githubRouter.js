import express from 'express';
import { githubController } from '../controllers/githubController.js';
import { authC } from '../controllers/authController.js';

const githubRouter = express.Router();

// accepts owner and repoName and gets commit history data (messages and patches of code)
githubRouter.post('/commits',
  authC.verify,
  githubController.connectOctokit,
  githubController.getCommits,
  (req, res) => res.status(200).json(res.locals.commits));

export { githubRouter };
