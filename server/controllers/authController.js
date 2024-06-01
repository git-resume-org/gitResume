import { config } from 'dotenv';
import fetch from 'node-fetch';

const authController = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

// the controller to call to check if token exists
authController.verify = async (req, res, next) => {
  if (req.session.accessToken) {
    console.log('authController.verify: accessToken:', req.session.accessToken);
    next();

  } else {
    console.log('authController.verify: no accessToken');
    res.json(false);
  }
};

authController.loginGh = async (req, res, next) => {
  // prompt=consent&
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

// this is called after the user has authenticated
authController.handleGhCallback = async (req, res, next) => {
  // console.log('authController: handleCallback');
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Code not provided');
    }
    req.session.accessCode = code;
    // console.log('authController: code retrieved from github oauth', code);
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

    // a data object containing the access token
    const data = await response.json();

    // the access token from github
    const accessToken = data.access_token;

    if (!accessToken) {
      return res.status(400).send('accessToken not retrieved');
    }

    console.log('authController: accessToken retrieved, stored in session', accessToken);

    // Store the token in session, by way of express-session
    req.session.accessToken = accessToken;

    return next();
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

authController.loginGhClose = (req, res, next) => {

console.log('authController: loginGhClose');
// next();
  res.send(`
    <script>
      window.opener.postMessage('loginGhClose', '${req.protocol}://${req.get('host')}');
      window.close();
    </script>
  `);

  // return
};

authController.verifyTokenTestPassed = (req, res, next) => {
  console.log('authController.verified: token verified.');
  // next();
  res.send(true);
}

authController.ghLogout = async (req, res, next) => {
  // prompt=consent&: // this prompts the reauthorization screen of github
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?prompt=consent&scope=repo&client_id=${ghClientId}`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

authController.error = (req, res, next) => {
  console.log('authController: error');
  res.send('Error');
};

export { authController };
