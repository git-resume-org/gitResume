import express from 'express';
import { authController } from '../controllers/authController.js';

const authRouter = express.Router();

// hit only during sign in
authRouter.get('/signin', (req, res) => {
  // console.log('authRouter: signin');
  if (req.session.accessToken) {

    console.log('authRouter: signin: token: true', req.session.accessToken);
    return res.json(true);
  } else {

    console.log('authRouter: signin: token: false');
    return res.json(false);
  }
});

authRouter.get('/ghLogin', authController.ghLogin);

// Handle GitHub callback and exchange code for access token
// this is the endpoint provided to github in the oauth setup.
// that is, 'http://localhost:8080/api/auth/call'
authRouter.get('/call', authController.handleGhCallback, authController.closeGhLogin);

authRouter.get('/verifyTokenTest', authController.verify, authController.verifyTokenTestPassed);

export { authRouter };
