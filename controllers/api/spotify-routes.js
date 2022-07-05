const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQBmT1pXox_cZgBfK1cW6KgqxTBJ1W_gwMEVsfqdfW1-_zcZyW9wubscbRi5YuVyBqAUB2oxEDZag1x0DGSNy19hT3CtnUY4S6cOXo7wE2B7V7RtAHNV92M-J-T96rTPusqp9cnckJSzOzWAAVc2SRkgUA9Xx7EWU8oUQDBpBpErwmlPoj5vf4ZaT4eWXodmij4MZAKSHD12tPuoVmo93Go9SjwJCv45ZwJFXyihYuY4H8ug3oP4eFCmEf_pfG13Kk2nwD231kbNQsZL8suu54ObwuALM3OZnmlKgG3xErOsyTY929vcaA0qNcvBKTsnyWCKFD0";

const spotifyApi = new SpotifyWebApi({
    clientId: '87505eacdc8642e1bcfee43d5ddca989',
    clientSecret: 'b9e0df3f205b42e0809ea37e1365c68e',
    redirectUri: 'http://localhost:3001/callback'
});
spotifyApi.setAccessToken(token);

// gets basic user information (currently just username)
router.get('/', (req, res) => {
    spotifyApi.getMe()
        .then(data => {
            let info = data.body;
            // gets user's display name
            let username = { 'username': info.display_name}
            res.json(username); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}); 

// display users top Songs
router.get('/songs', (req, res) => {
    spotifyApi.getMyTopTracks()
        .then(function(data) {
            let topTracks = data.body.items;
            // filters data to just the song name and the main artist name
            let topSongs = topTracks.map((data) => {
                return {
                    song: data.name,
                    artist: data.artists[0].name
                }
            });
            res.json(topSongs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// display users top Artists
router.get('/artists', (req, res) => {
    spotifyApi.getMyTopArtists()
        .then(data => {
            let artists = data.body.items;
            // filters data to only the artists name, followers, popularity index, and link respective link to spotify
            let topArtists = artists.map((data) => {
                return {
                    name: data.name,
                    followers: data.followers.total,
                    popularity: data.popularity,
                    link: data.external_urls.spotify
                }
            });
            res.json(topArtists);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



module.exports = router;
