import express from 'express';
import { authC } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/verify', authC.verify, (req, res) => {
  // console.log('authRouter: verify: true', 'req.user', req.user);
  res.json({ success: true });
}, (err, req, res, next) => {
  // this will be called if verify does not return next()
  console.log('authRouter: verify: false', 'err', err);
  res.json({ success: false });
});

authRouter.get('/signin', authC.verify);

// Handle GitHub callback and exchange code for access token
// this is the endpoint provided to github in the oauth setup.
// that is, 'http://localhost:8080/api/auth/call'
authRouter.get('/call', authC.tokenGet, authC.cookiesSet);

authRouter.get('/verifyTest', authC.verify, authC.verifyTest);

// signout
authRouter.get('/signout',
  authC.cookiesClear,
  // authC.signout
);

export { authRouter };
