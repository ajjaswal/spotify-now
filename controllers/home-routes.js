const router = require('express').Router();

// temporary spotify token and api dependencies
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQA2IZ9zBjoT872W_ZZ0qt5PW4nCe4sNdCmyAKbT3LOH9-MnUlCMZZmiCDan-RehfxDhgPJXgM1lVo4EwdHoWpRZmoJIHfNOgm5Y_k5sbH8ZP70PurAF88Nm_KVJekBSBXKbMaFfdvbRO7kJrUhPnqKVqk1Juq30ZDcf1DWU67JKWluz19k9an3KCpQkdCilpZ2xQIVhCer1XWE5szM6POWz4bX0z7vsFZYBZL6UGyGVVLB9BXjhOaj45D1UyLlYBNgynI_fUME-OQcEpuiwZn9YO3CiPaznnfi_Iw3rVQvpFtyO5VGJ7EJnQ4PDtLy2IqPb3sU";

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