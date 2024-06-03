import fetch from 'node-fetch';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import { getUserDataMeta, getUserDataMega } from '../services/githubService.js';
import { tokenGet, loginGet } from '../services/authService.js';

// set this to false if you don't want to get detailed user data.
const getUserDataMegaBool = false;

const authController = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const secretKey = process.env.SECRET_KEY;

// the controller to call to check if token exists

authController.verify = async (req, res, next) => {
  // console.log('authController: verify');
  const user = req.cookies?.user;

  if (!user) {
    console.log('authController.verify: ❌');
    res.json(false);
  } else {
    // decode the token (without verification) to quickly access its contents
    const decoded = jwt.decode(user, { complete: true });

    // access specific parts of the decoded token
    const payload = decoded.payload; // the main content of the token
    const header = decoded.header; // the header of the token
    console.log('authController.verify: ✅');
    const tokenDecoded = payload.token;
    const usernameDecoded = payload.username;

    // console.log('authController.verify: tokenDecoded', tokenDecoded);
    // console.log('authController.verify: usernameDecoded', usernameDecoded);
    next();
  }
};

// this is called after the user has authenticated
authController.tokenGet = async (req, res, next) => {
  try {
    const token = await tokenGet(req.query.code);
    if (!token) {
      return res.status(400).send('accessToken not retrieved');
    }

    console.log('token', token);

    const userDataMeta = await getUserDataMeta(token);
    if (userDataMeta) {
      console.log('authController: user retrieved from github', userDataMeta.login);
    }

    if (userDataMeta.login && getUserDataMegaBool) {
      await getUserDataMega(token, userDataMeta.login);
    }

    const userPayload = { token: token, userDataMeta: userDataMeta, userAuth: true, username: userDataMeta.login };
    // console.log('authController: userPayload', userPayload);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
}

authController.cookiesSet = async (req, res, next) => {
  console.log('authController: cookiesSet');
  try {
    const user = jwt.sign(req.user, secretKey, { expiresIn: '3m' });
    res.cookie('user', user, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    next();
    res.send(`
    <script>
      window.opener.postMessage('loginGhClose', '${req.protocol}://${req.get('host')}');
      window.close();
    </script>
  `);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
}

// authController.loginClose = (req, res, next) => {
//   console.log('authController: loginGhClose');
//   // next();

// };

authController.verifyTest = (req, res, next) => {
  // console.log('authController.verifyTest: token verified.');
  // const token = req.cookies.token;
  // another example of storing user data in the cookie, this time after verifying the token

  // // next();
  // res.send(req.user);
  res.json(true);
}

authController.cookiesClear = (req, res, next) => {
  console.log('authController: cookieClear');
  // res.clearCookie('token');

  if (req.cookies) {
    Object.keys(req.cookies).forEach(cookieName => {
      res.clearCookie(cookieName);
    });
  }

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
