// server.ts
import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
// import cors from 'cors';
// import fetch from 'node-fetch';
config();

import { authRouter } from './routes/authRouter.js';

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

const app = express();
const PORT = 3000;
// app.use(express.json());
// app.use(cors());

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use secure cookies in production
}));

app.use('/api/auth/', authRouter);

app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log('\n\n');
});
