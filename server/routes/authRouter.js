import express from 'express';

import { authController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/checkToken', (req, res) => {
  // console.log('authRouter: checkToken');
  if (req.session.accessToken) {
    console.log('authRouter: get: accessToken already set', req.session.accessToken);
    return res.json({ tokenExists: true });
  } else {
    console.log('authRouter: get: accessToken not set');
    return res.json({ tokenExists: false });
  }
})

authRouter.get('/get', authController.get, (req, res) => {
});

// Handle GitHub callback and exchange code for access token
authRouter.get('/call', authController.handleCallback, authController.success, /*authController.getUser,*/(req, res) => {
  // console.log('authRouter/call');
  // console.log('\n\n');
  res.json({
    accessToken: res.locals.accessToken,
    // user: res.locals.user,
  });
});

export { authRouter };


// authRouter.get('/success', authController.success, (req, res) => {
//   console.log('authRouter/success');
//   console.log('\n\n');
// });

// authRouter.get('/get', (req, res) => {
//   console.log('authRouter: get /get');
//   console.log('\n\n');
//   const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&redirect_uri=http://localhost:3000/api/auth/call&scope=user`;
//     res.redirect(redirectURI);
//   // return res.status(200).send('get');
// });
