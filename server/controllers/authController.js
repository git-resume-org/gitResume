import { config } from 'dotenv';
import fetch from 'node-fetch';

const authController = {};

config();

const ghClientId = process.env.GH_CLIENT_ID;
const ghClientSecret = process.env.GH_CLIENT_SECRET;

authController.get = async (req, res, next) => {
  // console.log('authController: get ');
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&redirect_uri=http://localhost:3000/api/auth/call&scope=user`;
    res.redirect(redirectURI);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

authController.handleCallback = async (req, res, next) => {
  // console.log('authController: handleCallback');
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Code not provided');
    }
    // console.log('authController: code retrieved from github oauth', code);
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

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      return res.status(400).send('Access token not retrieved');
    }

    // console.log('authController: accessToken retrieved, stored in session', accessToken);

    // Store the token in session
    req.session.accessToken = accessToken;

    // Pass the token to the next middleware. can probaly forego this given we're storing it in session
    res.locals.accessToken = accessToken;

    return next();
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
};

authController.success = (req, res, next) => {

  // res.send('Success');
  res.send(`
    <script>
      window.opener.postMessage('authComplete', '${req.protocol}://${req.get('host')}');
      window.close();
    </script>
  `);
};



export { authController };


/*
    res.send(`
    <script>
      window.opener.postMessage({ message: 'authComplete', command: 'close' }, '${req.protocol}://${req.get('host')}');
    </script>
  `);
  */

// authController.getUser = async (req, res, next) => {
//   console.log('authController: getUser');
//   try {
//     const accessToken = res.locals.accessToken;

//     const userResponse = await fetch('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const userData = await userResponse.json();
//     res.locals.user = userData;

//     return next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// };


// const oauth_app = new OAuthApp({
//   clientType: "oauth-app",
//   clientId: ghClientId,
//   clientSecret: ghClientSecret,
// });

// oauth_app.on("token", async ({ token, octokit }) => {
//   const { data } = await octokit.request("GET /user");
//   console.log(`Token retrieved for user: ${data.login}`);
// });

// const gh_oauth_app = createNodeMiddleware(oauth_app);

// authController.get = async (req, res) => {
//   console.log('authController: /get');
//   console.log('\n\n');
//   const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&redirect_uri=http://localhost:3000/api/auth/call&scope=user`;
//   res.redirect(redirectURI);
//   console.log('\n\n');
//   console.log('authController: redirecting to', redirectURI);
// };
