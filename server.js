const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

var SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const PORT = process.env.PORT || 3001;

//parsing middleware
//parse application
app.use(bodyParser.urlencoded({extended: false}));

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

//allow public folder
app.use(express.static(__dirname + '/public'));

// https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js
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
  const token = 'BQBj54ygWao5JT9LIdHWPVm-ywocy4riDvnXmp-MVr5K_2KTQLnKlODRXVEU3fO3QZJqyusLJgJkZ7T6h5GC1OBxbiGiLHhYQXz196G0gVlAosA4kZ9Pl7XAiupGNGDZujg2iVXnABp6AGz4OyudayKU0ucuGNZgiMt34oX3_AXw2k2D9-xoNNEo2yTOMSlBERmH0MgRF8eN7bsec8MEUsTCSypeksrvC4IzoEfCcDYC2fzmSdY48KpjK0l_gzQDAc7rg_N7bbWX1Pj0I6U4Glpso-70Tc31A3QfcPUUsq1umltaNRJJf38y0hMY';
  spotifyApi.setAccessToken(token);

  
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

//templating engine 
app.engine('hbs', exphbs.engine( {extname: '.hbs'}));
app.set('view engine', 'hbs');

//handlebars routes 
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => console.log(`now listening go to http://localhost:${PORT}/login`));