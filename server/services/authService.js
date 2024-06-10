
import axios from 'axios';
import { config } from 'dotenv';

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

const authService = {};

authService.tokenGet = async (code) => {
  try {
    // console.log('authService: code', code);
    if (!code) {
      throw new Error('AuthService:Code not provided');
    }

    console.log('authService: code ✔️');

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

    const data = await response.data;
    console.log('authService: response', data);
    // the access token from github
    const { access_token } = data;
    // console.log('authService: token', access_token);

    return access_token;
  } catch (err) {
    console.log('authService: token error', err);
    throw new Error('Error retrieving token');
  }
}

export { authService }
