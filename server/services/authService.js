import fetch from 'node-fetch';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'node:fs';
import { config } from 'dotenv';

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const ghToken = process.env.GH_TOKEN;

const authService = {};

// authService.tokenGet = async (code) => {
//   if (!code) {
//     console.log('authService: code not provided, returning code not provided');
//     return res.status(400).send('Code not provided');
//   }

//   // the request to exchange the code for an access token
//   const response = await fetch('https://github.com/login/oauth/access_token', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       client_id: ghClientId,
//       client_secret: ghClientSecret,
//       code,
//     }),
//   });

//   // the access token from github
//   const { access_token } = await response.json();
//   console.log('authService: token', access_token);
//   return access_token;

// }


authService.tokenGet = async (code) => {
  try {
    if (!code) {
      console.log('authService: code not provided, returning code not provided');
      return res.status(400).send('Code not provided');
    }

    // the request to exchange the code for an access token
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: ghClientId,
      client_secret: ghClientSecret,
      code,
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // the access token from github
    const { access_token } = response.data;
    console.log('authService: token', access_token);

    // replace the value of GH_TOKEN in .env with access_token
    const envFilePath = './.env';
    const envFileContent = readFileSync(envFilePath, 'utf-8');
    const envFileLines = envFileContent.split('\n');
    const ghTokenLineIndex = envFileLines.findIndex(line => line.startsWith('GH_TOKEN='))
    if (ghTokenLineIndex !== -1) {
      envFileLines[ghTokenLineIndex] = `GH_TOKEN=${access_token}`;
      const newEnvFileContent = envFileLines.join('\n');
      writeFileSync(envFilePath, newEnvFileContent, 'utf-8');
    }

    return access_token;
  } catch (err) {
    console.log('authService: token error', err);
    return res.status(500).send('Error retrieving token');
  }
}


export { authService }
