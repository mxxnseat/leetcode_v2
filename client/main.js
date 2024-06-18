const auth0Auth = new auth0.WebAuth({
  domain: 'https://dev-37ivhlbt0an174v2.us.auth0.com',
  clientID: 'Z3Dm0QYxel4DbBYCFsP7XA0mhH92IGhv',
});

auth0Auth.authorize({
  audience: 'https://dev-37ivhlbt0an174v2.us.auth0.com/api/v2/',
  responseType: 'token',
  redirectUri: 'https://open-mildly-tick.ngrok-free.app/auth0/callback',
});
