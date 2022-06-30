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
  clientId: '87505eacdc8642e1bcfee43d5ddca989',
  clientSecret: 'b9e0df3f205b42e0809ea37e1365c68e',
  redirectUri: 'http://localhost:3001/callback'
});

// go to this link to get access token in console
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// spotify api parses data and gives access token
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
  // const token = 'BQB85_rjYbw4PH-tA9-3qR4oOVhaF_JZkRIOEofNraNlfR_K_RepCOoHP8lP0KDPWPSDuZLcj6KaJ-i2izkH6O0cUyTby3Pfcadbq8PKMNcD-81j00qScS4iXHVbqVYe_T5TGyT9qOdF-1RJ7KvWx3fDEKcgnGIL6oU7lNAkb9gCQFYt55OnzOXpGqWeDpqySk-DbGPEqdVWwEjy6tPbLR0E_MviNDQ9LAz3_mjOPIjIRWbIfk3jBY7jH_Yvm2Fc8-GsMagwNydTdjn8a4UzBmz-IqBo1cap2D_SGIeJAi7mxOJpzf81WhP7HjNNqBtjZo5g41k';
  // spotifyApi.setAccessToken(token);

app.use(routes);

app.listen(PORT, () => console.log(`now listening go to http://localhost:${PORT}`));