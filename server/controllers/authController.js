import fetch from 'node-fetch';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import { ghService } from '../services/githubService.js';
import { authService } from '../services/authService.js';

const authC = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const secretKey = process.env.SECRET_KEY;

// the controller to call to check if token exists

authC.verify = async (req, res, next) => {
  // console.log('authC: verify');
  const user = req.cookies?.user;

  if (!user) {
    console.log('authC.verify: ❌ ', new Date().toLocaleTimeString());
    res.json({ success: false, message: 'Unauthorized: no token' });
    // return req.path === '/signin' ? res.json(false) : res.status(401).json({ error: 'Unauthorized: No token provided' })
  } else {
    // decode the token (without verification) to quickly access its contents
    const decodedJwt = jwt.decode(user, { complete: true });

    jwt.verify(user, secretKey, (err, verifiedPayload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('authC.verify: ❌ Token expired');
          res.json({ success: false, message: 'Unauthorized: Token expired' });

          // return req.path === '/signin' ? res.json(false) : res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        console.log('authC.verify: ❌ Token verification failed', err);
        res.json({ success: false, message: 'Unauthorized: Token verification failed' });
        // return req.path === '/signin' ? res.json(false) : res.status(403).json({ error: 'Forbidden: Token verification failed' });
      }
      // access specific parts of the decoded token
      const payload = decodedJwt.payload; // the main content of the token
      const header = decodedJwt.header; // the header of the token
      console.log('authC.verify: ✅ ', new Date().toLocaleTimeString());
      const tokenDecoded = payload.token;
      const usernameDecoded = payload.username;

      // console.log('authC.verify: tokenDecoded', tokenDecoded);
      // console.log('authC.verify: usernameDecoded', usernameDecoded);

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
    const token = await authService.tokenGet(req.query.code);
    if (!token) {
      return res.status(400).send('accessToken not retrieved');
    }

    console.log('token', token);

    const userDataMeta = await ghService.getUserDataMeta(token);
    if (userDataMeta) {
      console.log('authC: user retrieved from github', userDataMeta.login);
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

    console.log('authC: cookiesSet: about to close window');

    next();

    res.send(`
    <script>
    window.opener.postMessage('success', '*');
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
  if (req.cookies) {
    try {
      Object.keys(req.cookies).forEach(cookieName => {res.clearCookie(cookieName)});
      console.log('authC: cookies cleared');
      res.json({ success: true, message: 'cookies cleared' });

    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Error: cookies not cleared' });
    }
  }
  next();
};

authC.signout = async (req, res, next) => {
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
