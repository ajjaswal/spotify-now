const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;



var SpotifyWebApi = require('spotify-web-api-node');


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

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

// credentials from spotify developers dashboard
// need to add redirectUri to spotify developers dashboard settings
var spotifyApi = new SpotifyWebApi({
  clientId: 'be6d6cea500242db91d8960be9638a5d',
  clientSecret: '2c1169e6b3cb44359989797fddc1954f',
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
      //res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);

      //renders the top artists
      spotifyApi.getMyTopArtists()
        .then(data => {
          let artists = data.body.items;
          // filters data to only the artists name, followers, popularity index, and link respective link to spotify
          let topArtists = artists.map((data) => {
            return {
              id: artists.indexOf(data) + 1,
              name: data.name,
              followers: data.followers.total,
              popularity: data.popularity,
              link: data.external_urls.spotify,
              image: data.images[0].url
            }
          });
          spotifyApi.getMyTopTracks()
            .then(function (data) {
              let topTracks = data.body.items;
              // filters data to just the song name and the main artist name
              let topSongs = topTracks.map((data) => {
                return {
                  id: topTracks.indexOf(data) + 1,
                  image: data.album.images[0].url,
                  name: data.name,
                  artist: data.artists[0].name,
                  popularity: data.popularity,
                  link: data.external_urls.spotify
                }
              });
              spotifyApi.getMe()
                .then(data => {
                  let info = data.body;
                  // gets user's display name
                  let username = { 'username': info.display_name }
                  res.render('stats', {
                    track: topSongs,
                    artist: topArtists,
                    me    : username
                  });
                  return;
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json(err);
                  return;
                });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json(err);
            });


        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });


    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(PORT, () => console.log(`now listening go to http://localhost:${PORT}`));

