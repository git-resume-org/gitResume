import express from 'express';
import { authC } from '../controllers/authController.js';
import { githubController } from '../controllers/githubController.js';
import { openaiC } from '../controllers/openaiController.js';

const openaiRouter = express.Router();
const generateRouter = express.Router();

generateRouter.post('/bulletPoints',
  authC.verify,
  githubController.connectOctokit,
  githubController.getCommits,
  openaiC.generate.bulletPoints,
  (req, res) => res.status(200).json(res.locals));

openaiRouter.use('/generate', generateRouter);

export { openaiRouter };
