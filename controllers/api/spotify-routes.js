const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQBtaXc_DuqXVx6THr0m5rbak9lA9ZyJg5o4LEqrfMtpXe_jQX9h8HSoOqHuAmFCTLFLcwoAeUt-HARqJ4zjBNnh8QMZWIlkCJacqjnNVyW0cbChrHaymCnZrWMqHxAWAiCnxwgR3j4e0U3Wk7EckLkRFy4fG26hf22nLWlqTngqpcJ5v6bJ8_geV5x9D1Az_pzzN6uZ9y1L2PYyOd0ORoswcRciGYIK6XnI4PxQj79RYY887EZsY8W76UQJiiMWqxV2H76AQxo42nR3U5ubYsgvsAWQeDdiiVpe7Zazwlmu-Zryc4jnL50UslOEfG2WVswkIKM";

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
                    artist: data.artists[0].name,
                    image: data.album.images[1].url
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
                    link: data.external_urls.spotify,
                    image: data.images[0].url
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
