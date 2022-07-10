const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");

const token ="BQCQE7nsqElXiYRH0QN6xwll3Bo070eoQzv6SxzMQWFwD7fKe-kP_Zr7s9xOe1jOogUrfHuE_iL-xlBbUIrbgO362clKmN_K-3BbP4BDR3J49A8p8u1xfzDuq0xhrygfIZ5WbqhH3FyamN5j2Zt4kWi4W1Ho3d7B1Nes-pHUDq_ozyfoVJgEiH8NrIw3oUqV6SSBE7ojZjcNF6C1bjm03OssB9azYbDhLt9LiehX43JvqjeM9bnU_vflNTgI9zpooYfDZYRAXBcheQ_D_1xkerPvQBAg7yHBEN-aR2c7RiR3DAQj_7I2lqzt7gt_";

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
                    /*
                    song: data.name,
                    artist: data.artists[0].name,
                    image: data.album.images[1].url
                    */
                   uri: data.uri
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

router.get('/playlists', (req, res) => {
    spotifyApi.getUserPlaylists()
    .then(data => {
        let info = data.body.items;
        let playlist = info.map((data) => ({
            name: data.name,
            link: data.external_urls.spotify,
            href: data.href,
            length: data.tracks.total,
            tref: data.tracks.href,
        }));

        res.json(playlist);
        

    })
});

router.post('/playlists', (req, res) => {
    
    spotifyApi.createPlaylist('SpotifyNow',{'description': 'SpotifyNow generated playlist', 'public': true})
    .then(data => {
        let info = data.body.id;
        res.json(info);
})
});




module.exports = router;
