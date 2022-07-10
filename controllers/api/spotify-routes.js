const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQDv7Z5zEfQf5I_6plRUCU7BrxID4GDUzBwXpLZfFQRdfANpD9gDsZtUzLZiZQ6vJmmRQhSzw1cj21THGBYYIy3gpl7pRvZQJpquYw2aAALoNCLFs-x3I4d2L6TnPOUii4Rfhd01Nr6zrt1tgCnb1vZJ3xCVpSIJnOXhytNA08mXN_eCVVVE5GM0Jejs61Vu0P90zFhhVvZ8FftFI1JJ3pXUCNb2AiFqavm9HNmzNelQ-7TdMozo0vFxe0V9joeHa7MdYC_sxx8fGLCrYyyeo1bwI2AdoGhX2DigBqSGrPDK0VWDLRBPYDY2aes-fMhz3pw7Ww";

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
            res.json(info); 
            return;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            return;
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
            res.json(topTracks);
            
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
                    link: data.external_urls.spotify,
                    image: data.images[0].url
                }
            });
           
            res.json(artists);
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});





module.exports = router;
