const router = require('express').Router();

// temporary spotify token and api dependencies
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQBhlheas3za_uKhLQn9B2dI7y6Yb0FZim19lWzbe8oB5Iya1iM4hy4D9pTKq97zad_Q4HLfhYG43gs7GRz1pulxZJ2f_BwbdJ4KZeVW8GrMvnvz-ddUyymia0fr89lLWhWHJ3ZgF0_Ho7MlsMuYnK1QAeODcqqwCkBZnol0DmAJujJHWTOO7nyE2Z66wtaCZtMhuWsaIGkQEgmdS1fTtoTeBhY1FPbYfgbwFTxTsI0KVRyrSj6tZI7th57zf55i67NGcdSS_WARF_VY4QgNtNXgS0ZCD63g_Fzsn25ypAP_I_2eCRBOgBUfX_QyetpBWmYiRMw";

const spotifyApi = new SpotifyWebApi({
    clientId: '87505eacdc8642e1bcfee43d5ddca989',
    clientSecret: 'b9e0df3f205b42e0809ea37e1365c68e',
    redirectUri: 'http://localhost:3001/callback'
});
spotifyApi.setAccessToken(token);


// render front page
router.get('/', (req, res) => {
    res.render('home');
});

// renders stats page with user info
router.get('/stats', (req, res) => {
    spotifyApi.getMyTopArtists()
        .then(data => {
            let artistdata = data.body.items;
            // filters data to only the artists name, followers, popularity index, and link respective link to spotify
            let artists = artistdata.map(data => 
                ({
                    name: data.name,
                    followers: data.followers.total,
                    popularity: data.popularity,
                    link: data.external_urls.spotify,
                    image: data.images[0].url 
                })
            );
            artists.forEach((item, i) => {
                item.id = i + 1
            });
            res.render('stats', {artists});
        })
});



module.exports = router;