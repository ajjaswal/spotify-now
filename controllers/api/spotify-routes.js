const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
<<<<<<< HEAD
const token ="BQBhlheas3za_uKhLQn9B2dI7y6Yb0FZim19lWzbe8oB5Iya1iM4hy4D9pTKq97zad_Q4HLfhYG43gs7GRz1pulxZJ2f_BwbdJ4KZeVW8GrMvnvz-ddUyymia0fr89lLWhWHJ3ZgF0_Ho7MlsMuYnK1QAeODcqqwCkBZnol0DmAJujJHWTOO7nyE2Z66wtaCZtMhuWsaIGkQEgmdS1fTtoTeBhY1FPbYfgbwFTxTsI0KVRyrSj6tZI7th57zf55i67NGcdSS_WARF_VY4QgNtNXgS0ZCD63g_Fzsn25ypAP_I_2eCRBOgBUfX_QyetpBWmYiRMw";
=======
const token ="BQC9zOwbE0eWBlWL0thO5Ri92AFkMwtU_fa3mF8DyKJw09ZrmC8NfqDhQ0CTmSz-UPF-XkafhggE0by_6rLNT0iTVH7Up6NDzCn_K8tBeLX9YEcT_bIftZsy6YmkinvmzGPqTsGP9Op05Kgy8mk33n8HTifCf-rhMDjK5zXphb_BWWTRxhrqI3ZVvJWXhAxm_B2eGBoQ0XdGfSauI55Z2equMcte9iZC4a4OmevNXCrhtz-FQcBBiiZ5EuYZqoavVC4wvg15jgyPdPfHb6Op3ltEKz5xlrBVpIa_WL3u2-_WbaTgZohrvq4Msux0mBnIq0cV3Q";
>>>>>>> c82306e0b2e0fe165372a5712d59172fb34ea24d

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
