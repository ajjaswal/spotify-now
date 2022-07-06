const router = require('express').Router();

// temporary spotify token and api dependencies
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQBtaXc_DuqXVx6THr0m5rbak9lA9ZyJg5o4LEqrfMtpXe_jQX9h8HSoOqHuAmFCTLFLcwoAeUt-HARqJ4zjBNnh8QMZWIlkCJacqjnNVyW0cbChrHaymCnZrWMqHxAWAiCnxwgR3j4e0U3Wk7EckLkRFy4fG26hf22nLWlqTngqpcJ5v6bJ8_geV5x9D1Az_pzzN6uZ9y1L2PYyOd0ORoswcRciGYIK6XnI4PxQj79RYY887EZsY8W76UQJiiMWqxV2H76AQxo42nR3U5ubYsgvsAWQeDdiiVpe7Zazwlmu-Zryc4jnL50UslOEfG2WVswkIKM";

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
            console.log(artists)
            res.render('stats', {artists});
        })
});



module.exports = router;