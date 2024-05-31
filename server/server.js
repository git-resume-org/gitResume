// server.ts
import express from 'express';
import { OAuthApp, createNodeMiddleware } from "@octokit/oauth-app";
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const app = express();
const PORT = 3000;

const oauthApp = new OAuthApp({
  clientType: "oauth-app",
  clientId: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
});

oauthApp.on("token", async ({ token, octokit }) => {
  console.log('server.oauthApp.on token', token);
  const { data } = await octokit.request("GET /user");
  console.log(`Token retrieved for user: ${data.login}`);
});

app.use('/api/auth/github', (req, res) => {
  console.log('\n\n');
  console.log('server/auth/github');
  try {
    const ghNodeMiddleware = createNodeMiddleware(oauthApp, { pathPrefix: '' })

    app.use(ghNodeMiddleware);
    console.log(res.locals);

    res.send('Hello, world!');

  } catch (error) {
    console.log(error);
  }

});

app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(PORT, () => {
  console.log('server.ghClientId', process.env.GH_CLIENT_ID);
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log('\n\n');
});
