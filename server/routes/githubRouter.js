import express from 'express';
import { githubController } from '../controllers/githubController.js';
import { authC } from '../controllers/authController.js';
import { openaiC } from '../controllers/openaiController.js';

const githubRouter = express.Router();

// accepts owner and repoName and gets commit history data (messages and patches of code)
githubRouter.post('/commits',
  authC.verify,
  githubController.connectOctokit,
  githubController.getCommits,
  (req, res) => res.status(200).json(res.locals.commits));

githubRouter.post('/ghData',
  authC.verify,
  githubController.connectOctokit,
  githubController.getCommits,
  githubController.getOrgs,
  githubController.getEventsReceived,
  githubController.getPRs,
  openaiC.generateBullets,
  // githubController.getUserDataMega,
  (req, res) => res.status(200).json(res.locals));

export { githubRouter };
