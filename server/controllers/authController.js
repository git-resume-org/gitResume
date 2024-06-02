import { config } from 'dotenv';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { getUserDataBasic, getUserDataDetailed } from '../services/githubService.js';

// set this to false if you don't want to get detailed user data.
const getUserDataDetailedBool = true;

const authController = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;
const secretKey = process.env.SECRET_KEY;

// the controller to call to check if token exists
authController.verify = async (req, res, next) => {
  // console.log('authController: verify');
  const token = req.cookies.token;
  if (!token) {
    console.log('authController.verify: no token');
    res.json(false);
  } else {
    console.log('authController.verify: token exists');
    next();
  }
};

authController.login = async (req, res, next) => {
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

// this is called after the user has authenticated
authController.tokenGet = async (req, res, next) => {
  // console.log('authController: handleCallback');
  try {
    const { code } = req.query; // destructuring. same as const code = req.query.code;
    if (!code) {
      return res.status(400).send('Code not provided');
    }

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

    const userDataBasic = await getUserDataBasic(accessToken);
    if (userDataBasic) {
      console.log('authController: user retrieved from github', userDataBasic.login);
    }

    if (userDataBasic.login && getUserDataDetailedBool) {
      await getUserDataDetailed(accessToken, userDataBasic.login);
    }

    const tokenPayload = { accessToken: accessToken, userDataBasic: userDataBasic, userAuth: true };

    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '30m' });
    res.cookie('token', token, {
      // if true, cookie is not accessible from javascript, only from the server. this is to prevent XSS attacks.
      httpOnly: true,
      // if true, cookies will only be transmitted over https. Use true when deploying to production
      secure: false,
      // 'strict': the cookie will only be sent in a request if the request is made from the same site origin.
      // cookie added to example.com:
      // req(example.com/site) === true
      // req(blog.example.com) === false

      // 'lax': the cookie will be sent in a request if the request is made from the same site origin or the first-party origin is a subdomain of the site origin.
      // req(example.com/site) === true
      // req(blog.example.com) === true
      sameSite: 'strict',
    });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
}

authController.loginClose = (req, res, next) => {
  console.log('authController: loginGhClose');
  // next();
  res.send(`
    <script>
      window.opener.postMessage('loginGhClose', '${req.protocol}://${req.get('host')}');
      window.close();
    </script>
  `);
};

authController.verifyTokenTestPassed = (req, res, next) => {
  console.log('authController.verifyTokenTestPassed: token verified.');
  // const token = req.cookies.token;
    // another example of storing user data in the cookie, this time after verifying the token
    // jwt.verify(token, secretKey, (err, payload) => {
    //   if (err) return res.sendStatus(403);
    //   req.user = payload;
    //   // next();
    // });
    // // next();
    // res.send(req.user);
    res.json(true);
}

authController.tokenDelete = (req, res, next) => {
  console.log('authController: tokenDelete');
  res.clearCookie('token');
  next();
};

authController.logout = async (req, res, next) => {
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?prompt=consent&scope=repo&client_id=${ghClientId}`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
  next();
};


authController.error = (req, res, next) => {
  console.log('authController: error');
  res.send('Error');
};

export { authController };
