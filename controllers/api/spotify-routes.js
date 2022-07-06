const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQBhlheas3za_uKhLQn9B2dI7y6Yb0FZim19lWzbe8oB5Iya1iM4hy4D9pTKq97zad_Q4HLfhYG43gs7GRz1pulxZJ2f_BwbdJ4KZeVW8GrMvnvz-ddUyymia0fr89lLWhWHJ3ZgF0_Ho7MlsMuYnK1QAeODcqqwCkBZnol0DmAJujJHWTOO7nyE2Z66wtaCZtMhuWsaIGkQEgmdS1fTtoTeBhY1FPbYfgbwFTxTsI0KVRyrSj6tZI7th57zf55i67NGcdSS_WARF_VY4QgNtNXgS0ZCD63g_Fzsn25ypAP_I_2eCRBOgBUfX_QyetpBWmYiRMw";

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
