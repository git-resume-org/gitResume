import express from 'express';
import { authController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/login', authController.verify, (req, res) => {
  // this will be called only if verify returns next()
  res.send(true);
}, (err, req, res, next) => {
  // this will be called if verify does not return next()
  console.log(err);
  res.send(false);
});

// if login^ returns true, this then gets called by the front end.
authRouter.get('/login/gh', authController.loginGh);

// Handle GitHub callback and exchange code for access token
// this is the endpoint provided to github in the oauth setup.
// that is, 'http://localhost:8080/api/auth/call'
authRouter.get('/call', authController.handleGhCallback, authController.loginGhClose);

authRouter.get('/verifyTokenTest', authController.verify, authController.verifyTokenTestPassed);

export { authRouter };
