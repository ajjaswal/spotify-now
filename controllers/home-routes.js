const router = require("express").Router();
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// temporary spotify token and api dependencies
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
   clientId: "09efa3cfa0e84b848255d04d42cd5ed8",
   clientSecret: "a8ad2114b90045c8893d02d6446fabb0",
   redirectUri: "http://localhost:3001/callback",
});

// what data we want to access
const scopes = [
   "ugc-image-upload",
   "user-read-playback-state",
   "user-modify-playback-state",
   "user-read-currently-playing",
   "streaming",
   "app-remote-control",
   "user-read-email",
   "user-read-private",
   "playlist-read-collaborative",
   "playlist-modify-public",
   "playlist-read-private",
   "playlist-modify-private",
   "user-library-modify",
   "user-library-read",
   "user-top-read",
   "user-read-playback-position",
   "user-read-recently-played",
   "user-follow-read",
   "user-follow-modify",
];

// render front page
router.get("/", (req, res) => {
   res.render("home");
});

// renders stats page with user info
router.get("/stats", (req, res) => {
   // grabs key from node-cache
   let key = myCache.get("access_token");
   // sets access token from key
   spotifyApi.setAccessToken(key);

   // gets users top artists
   spotifyApi.getMyTopArtists().then((data) => {
      let artistData = data.body.items;
      // filters data to only the artists name, followers, popularity index, and link respective link to spotify
      let artists = artistData.map((data) => ({
         name: data.name,
         followers: data.followers.total,
         popularity: data.popularity,
         link: data.external_urls.spotify,
         image: data.images[0].url,
      }));
      artists.forEach((item, i) => {
         item.id = i + 1;
      });

      // gets uers top songs
      spotifyApi.getMyTopTracks().then(function (data) {
         let songData = data.body.items;
         // filters data to just the song name and the main artist name
         let songs = songData.map((data) => ({
            song: data.name,
            artist: data.artists[0].name,
            image: data.album.images[1].url,
         }));
         songs.forEach((item, i) => {
            item.id = i + 1;
         });

         // gets user's display name
         spotifyApi.getMe().then((data) => {
            let info = data.body;
            let username = { username: info.display_name };
            // sends data to stats handlebars
            res.render('stats', { artists, songs, username});
            res
          });
      });
   });
});

// render playlist page
router.get('/playlists', (req, res) => {
   // grabs key from node-cache
   let key = myCache.get("access_token");
   // sets access token from key
   spotifyApi.setAccessToken(key);
   // get user playlists
   spotifyApi.getUserPlaylists()
   .then(data => {
      let info = data.body.items;
      let playlist = info.map((data) => ({
         name: data.name,
         link: data.external_urls.spotify,
         length: data.tracks.total,
      }));
      // creates playlists. takes playlist name as argument
      spotifyApi.createPlaylist('songs',{'description': 'SpotifyNow generated playlist', 'public': true})
      .then(data => {
         // playlist id from created playlist
         let getId = data.body.id;
         // get user top tracks
         spotifyApi.getMyTopTracks().then(function(data){
            let getTracks = data.body.items;
           // get track uri to pass into add tracktoplaylist
            let topSongs = getTracks.map((data) => ({ 
               uri: data.uri
           }))

           
           // Error parsin json passing topsongs    
            // spotifyApi.addTracksToPlaylist(getId, topSongs);
         }) 
      })
      
      res.render('playlists', {playlist});
   })
   
})
// credentials from spotify developers dashboard
// need to add redirectUri to spotify developers dashboard settings

// go to this link to get access token in console
router.get("/login", (req, res) => {
   res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// spotify api parses data and gives access token
router.get("/callback", (req, res) => {
   const error = req.query.error;
   const code = req.query.code;
   const state = req.query.state;

   if (error) {
      console.error("Callback Error:", error);
      res.send(`Callback Error: ${error}`);
      return;
   }

   spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
         const access_token = data.body["access_token"];
         const refresh_token = data.body["refresh_token"];
         const expires_in = data.body["expires_in"];

         spotifyApi.setAccessToken(access_token);
         spotifyApi.setRefreshToken(refresh_token);

         console.log("access_token:", access_token);
         console.log("refresh_token:", refresh_token);

         console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
         // res.send('Success! You can now close the window.');

         // sends user back to home after logging in through spotify
        

         myCache.set("access_token", access_token);

         // tokens.push({ 'access_token': access_token, 'refresh_token': refresh_token });

         setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const access_token = data.body["access_token"];

            console.log("The access token has been refreshed!");
            console.log("access_token:", access_token);
            spotifyApi.setAccessToken(access_token);
         }, (expires_in / 2) * 1000);
         res.redirect("/stats");
      })
      .catch((error) => {
         console.error("Error getting Tokens:", error);
         res.send(`Error getting Tokens: ${error}`);
      });
});

module.exports = router;
