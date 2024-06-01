import { config } from 'dotenv';
import fetch from 'node-fetch';

const authController = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

// the controller to call to check if token exists
authController.verify = async (req, res, next) => {
  if (req.session.accessToken) {

    console.log('authController: verify: accessToken already set', req.session.accessToken);
    res.json(true);

    return next();
  } else {

    console.log('authController: verify: accessToken not set');
    return res.json(false);
  }
};

authController.ghLogin = async (req, res, next) => {
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

authController.closeGhLogin = (req, res, next) => {
console.log('authController: closeGhLogin');
  res.send(`
    <script>
      window.opener.postMessage('closeGhLogin', '${req.protocol}://${req.get('host')}');
      window.close();
    </script>
  `);

  return next();
};

authController.verifyTokenTestPassed = (req, res, next) => {
  console.log('authController.verified: token verified. Routes protected.');
  res.send('Verified');
  return next();
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
