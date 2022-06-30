const express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
const routes = require('./controllers');
// what data we want to access 
const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'

];
const app = express();
const PORT = process.env.PORT || 3001;
// credentials from spotify developers dashboard
// need to add redirectUri to spotify developers dashboard settings
var spotifyApi = new SpotifyWebApi({
    clientId:'09efa3cfa0e84b848255d04d42cd5ed8',
    clientSecret: 'a8ad2114b90045c8893d02d6446fabb0',
    redirectUri: 'http://localhost:3001/callback'
});

// go to this link to get access token in console
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});


app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });

  // access token from /login route
  //const token = 'BQB33Mqrs0C_NX5tYipfZh1nBaCWGCvTcGpxhsEvUsyFdRk94uorLksmaPmbYtlA9FksxHOqGbVLTu-_LZ3snaCuBe3_BxiIEKbG3f_laRnGlGDVh1gZgPHxhcWsAHdgc50mTw8ISrOkR3nUYsVZJwh6cAUFRuMU3QvkTpKEqcyE4uH4_10eYhL1iWHCigC_DcPoo1EzEwkeRnDrVyStUn-vZ9N85V4uhtIfFV674_FMQjl4Jf151A5hht4eWIjIy_DqBURI8Rc6MYTuK9FSHSAFNXKtRwK4v84C_LUQNHVa4QcrJxHznQ_RrRTD';
 // spotifyApi.setAccessToken(token);

  
  /*
  // user information
  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 */

  /*
  // get users top artists
  spotifyApi.getMyTopArtists()
  .then(function(data) {
    let topArtists = data.body.items;
    console.log(topArtists);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 */

  /*
  // get users top tracks
  spotifyApi.getMyTopTracks()
  .then(function(data) {
    let topTracks = data.body.items;
    console.log(topTracks);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 */
app.use(routes);
app.listen(PORT, () => console.log(`now listening go to http://localhost:${PORT}/login`));