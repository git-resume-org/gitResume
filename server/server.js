// server.ts
import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';

import { authRouter } from './routes/authRouter.js';
import { githubRouter } from './routes/githubRouter.js';

config();
const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

const app = express();
const PORT = 3000;

app.use(express.json());

// session middleware is used to store info about the user
// in a 'session object' which is stored on the server
// and identified by a unique cookie in the user's browser.
// When the user makes a request, the cookie is sent to the server
// and the server uses the cookie to access the session object.
// The session object is stored in memory by default, but it can
// be configured to store in a database or other storage system.

app.use(session({
  secret: sessionSecret, // a secret string used to encrypt the session cookie
  resave: false, // if true, store session data in server memory.
  saveUninitialized: false, // if true, save a session to the store even if it is not modified
  cookie: { secure: false } // if true, cookies will only be transmitted over https. Use when deploying to production
}));

app.use('/api/auth/', authRouter);

app.use('/api/github', githubRouter);

app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log('\n\n');
});
