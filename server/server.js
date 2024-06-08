// server.ts
import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/authRouter.js';
import { githubRouter } from './routes/githubRouter.js';
import { openaiRouter } from './routes/openaiRouter.js';

config();
const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const secretKey = process.env.SECRET_KEY;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// app.use(session({
//   secret: sessionSecret, // a secret string used to encrypt the session cookie
//   resave: false, // if true, store session data in server memory.
//   saveUninitialized: false, // if true, save a session to the store even if it is not modified
//   cookie: { secure: false } // if true, cookies will only be transmitted over https. Use when deploying to production
// }));

app.use('/api/auth/', authRouter);

app.use('/api/github/', githubRouter);

app.use('/api/openai/', openaiRouter);

app.get('/', (req, res) => {
  res.send('Home page');
});

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
