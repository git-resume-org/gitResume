import { OAuthApp, createNodeMiddleware } from "@octokit/oauth-app";

import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '.server.env') });

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

console.log('ghClientId', ghClientId);
console.log('ghClientSecret', ghClientSecret);

const oauth_app = new OAuthApp({
  clientType: "oauth-app",
  clientId: ghClientId,
  clientSecret: ghClientSecret,
});

// const oauth_app = new OAuthApp({
//   clientType: "oauth-app",
//   clientId: ghClientId as string,
//   clientSecret: ghClientSecret as string,
// });

oauth_app.on("token", async ({ token, octokit }) => {
  const { data } = await octokit.request("GET /user");
  console.log('\n\n');
  console.log(`Token retrieved for user: ${data.login}`);
  console.log('\n\n');
});

const gh_oauth_app = createNodeMiddleware(oauth_app);



export { gh_oauth_app };
