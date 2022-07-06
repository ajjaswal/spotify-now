const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQAfl7NT846dL3j0EBMjhNY9zS1Y9bk4KES10-kyTHWqgzVVJIeAgtLvLZLxCDJRtTG1tNKb4Mk8cjBfbMh-hVbHIpAvTqvrQubLv48zE0oUDMuLAzKeE3Wt-lXn0ic0C9jnp5SFAOJdtLGH6l2PX-1VnX4KIdr7365yAmfQDrY0YkznFx_LRtlkxJdJC4U5OR8ATmCKTS1fTnUQIIcL4aKmUTnIENgfFsW9O4DRZJYiZ4kvk0GlcnTjc_6fUjZkoyVCJlVkxj4Vh0tEnXFOkArNVlgzQv0hv-AHBawQI6fPfOteBXKHRiQik39uKwTySpp_sA";

const spotifyApi = new SpotifyWebApi({
    clientId: 'be6d6cea500242db91d8960be9638a5d',
    clientSecret: '2c1169e6b3cb44359989797fddc1954f',
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
                    id: artists.indexOf(data) + 1,
                    name: data.name,
                    followers: data.followers.total,
                    popularity: data.popularity,
                    link: data.external_urls.spotify
                }
            });
           
            res.render('stats', {
                artist: topArtists});
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});




module.exports = router;
