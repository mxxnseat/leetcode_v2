import auth0 from 'auth0-js';
if (window.location.pathname !== '/auth0/callback') {
  const auth0Auth = new auth0.WebAuth({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
  });

  auth0Auth.authorize({
    audience: 'leetcode',
    responseType: 'token',
    connection: 'leetcode',
    scope: 'openid profile leetcode.tag:user',
    redirectUri: 'http://localhost:3000/auth0/callback',
  });
} else {
  const accessToken = location.href.match(/access_token=(.*?)&/)[1];
  document.querySelector('body').innerText = accessToken;
}
