import express from 'express';
import { authC } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/login', authC.verify, (req, res) => {
  // this will be called only if verify returns next()
  res.send(true);
}, (err, req, res, next) => {
  // this will be called if verify does not return next()
  console.log(err);
  res.send(false);
});


// Handle GitHub callback and exchange code for access token
// this is the endpoint provided to github in the oauth setup.
// that is, 'http://localhost:8080/api/auth/call'
authRouter.get('/call', authC.tokenGet, authC.cookiesSet);

authRouter.get('/verifyTest', authC.verify, authC.verifyTest);

// logout
// not yet implemented on the front end
authRouter.get('/logout', authC.cookiesClear, authC.logout);

export { authRouter };
