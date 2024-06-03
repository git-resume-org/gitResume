import fetch from 'node-fetch';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import { getUserDataMeta, getUserDataMega } from '../services/githubService.js';
import { tokenGet } from '../services/authService.js';

// set this to false if you don't want to get detailed user data.
const getUserDataMegaBool = false;

const authC = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const secretKey = process.env.SECRET_KEY;

// the controller to call to check if token exists

authC.verify = async (req, res, next) => {
  // console.log('authC: verify');
  const user = req.cookies?.user;

  if (!user) {
    console.log('authC.verify: ❌');
    console.log('authC.verify: path', req.path);
    return req.path === '/login' ? res.json(false) : res.status(401).json({ error: 'Unauthorized: No token provided' })
  } else {
    // decode the token (without verification) to quickly access its contents
    const decodedJwt = jwt.decode(user, { complete: true });

      // access specific parts of the decoded token
      const payload = decodedJwt.payload; // the main content of the token
      const header = decodedJwt.header; // the header of the token
      console.log('authC.verify: ✅');
      const tokenDecoded = payload.token;
      const usernameDecoded = payload.username;

      // console.log('authC.verify: tokenDecoded', tokenDecoded);
      // console.log('authC.verify: usernameDecoded', usernameDecoded);

    jwt.verify(user, secretKey, (err, verifiedPayload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('authC.verify: ❌ Token expired');
          return req.path === '/login' ? res.json(false) : res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        console.log('authC.verify: ❌ Token verification failed', err);
        return req.path === '/login' ? res.json(false) : res.status(403).json({ error: 'Forbidden: Token verification failed' });
      }

      verifiedPayload.username = usernameDecoded;
      verifiedPayload.token = tokenDecoded;

      // console.log('authC.verify: verifiedPayload', verifiedPayload);
      req.user = verifiedPayload;

      next();
    });
  }
};

// this is called after the user has authenticated
authC.tokenGet = async (req, res, next) => {
  try {
    const token = await tokenGet(req.query.code);
    if (!token) {
      return res.status(400).send('accessToken not retrieved');
    }

    console.log('token', token);

    const userDataMeta = await getUserDataMeta(token);
    if (userDataMeta) {
      console.log('authC: user retrieved from github', userDataMeta.login);
    }

    if (userDataMeta.login && getUserDataMegaBool) {
      await getUserDataMega(token, userDataMeta.login);
    }

    const userPayload = { token: token, userDataMeta: userDataMeta, userAuth: true, username: userDataMeta.login };
    // console.log('authC: userPayload', userPayload);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
}

authC.cookiesSet = async (req, res, next) => {
  console.log('authC: cookiesSet');
  try {
    const user = jwt.sign(req.user, secretKey, { expiresIn: '30d' });
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

authC.verifyTest = (req, res, next) => {
  // console.log('authC.verifyTest: token verified.');
  // const token = req.cookies.token;
  // another example of storing user data in the cookie, this time after verifying the token

  // // next();
  // res.send(req.user);
  res.json(true);
}

authC.cookiesClear = (req, res, next) => {
  console.log('authC: cookieClear');
  // res.clearCookie('token');

  if (req.cookies) {
    Object.keys(req.cookies).forEach(cookieName => {
      res.clearCookie(cookieName);
    });
  }

  next();
};

authC.logout = async (req, res, next) => {
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?prompt=consent&scope=repo&client_id=${ghClientId}`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
  next();
};


authC.error = (req, res, next) => {
  console.log('authC: error');
  res.send('Error');
};

export { authC };
