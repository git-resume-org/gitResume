// server.ts
import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { authRouter } from './routes/authRouter.js';
import { githubRouter } from './routes/githubRouter.js';
import { openaiRouter } from './routes/openaiRouter.js';

config();
const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const secretKey = process.env.SECRET_KEY;

const MODE = process.env.NODE_ENV || 'development';
console.log('server.js: environment: ', MODE);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

MODE === 'production' ? app.use(express.static(path.join(__dirname, '../dist'))) : null;

app.use('/api/auth/', authRouter);

app.use('/api/github/', githubRouter);

app.use('/api/openai/', openaiRouter);

MODE === 'production' ? app.get('/*', (req, res) => {res.sendFile(path.join(__dirname, '../dist', 'index.html'));}) : null;

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log('\n\n');
});
