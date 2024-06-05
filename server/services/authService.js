import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

const authService = {};

authService.tokenGet = async (code) => {
  if (!code) {
    console.log('authService: code not provided, returning code not provided');
    return res.status(400).send('Code not provided');
  }

  // the request to exchange the code for an access token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: ghClientId,
      client_secret: ghClientSecret,
      code,
    }),
  });

  // the access token from github
  const { access_token } = await response.json();
  console.log('authService: token', access_token);
  return access_token;

}

export { authService }
