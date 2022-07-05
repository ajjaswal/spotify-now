const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQA5v99_GiIP2xcxcKJWbkXgCQnnUzH2s3GUZLxocksYxs8Dtx-XKSL5yrznmMKTJNjTgk7JT_6m3TVJyl1gui_1_i_r3bjv993lKGmYY_9Qc9D7ndlRn_vLcnVQFBToXfEy4b92Eb9BK9gCG-8PwlX_gxHXxfdtdMTNonMRr3T4fVeRAuE_tW7M_EVvwXy2Hh4eDkhKLHPm8UZsY4v_nfURx1zaHCZZBIT0E4gMe6wT5E4llDSuIN7vJrrlhxE7N1ArkFNdLOjFrgmSFgLe6kJudotxGx_Z1pXmnjgURGAbwGxf-tOvhSvdRpaaBwn32sF5HPQ";

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
