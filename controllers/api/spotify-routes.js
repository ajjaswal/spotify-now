const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQCaO0030JEg8h-UafDlboeA8_uajcr3xGzHucLZ5XBO4LHFWhgxZIF0BTOVQTZxDFIbVvq31QXJSKjp4uWkSexTz-LxCxA10KXkemOgbDxQwhIL4o7BXhS8yxjpKfBZ_gO5Gke3Vl1aTpQs5O5SXZrCR0obyKIyjKkMgslwmP4d7srQdYboISzSwpc60gcWaC6TaWYKRtZOSREjOSDaaZCFyIzd1tWsqrhrRspuMzZYBFoJsgM5-rnjFtPNW1_cxbMuEx8RSCNHdbElbQpyOKJvzNkbmTM-LYktBUGFBPO-kOw27UHWEXV9b_LQ";

const spotifyApi = new SpotifyWebApi({
    clientId: '09efa3cfa0e84b848255d04d42cd5ed8',
    clientSecret: 'a8ad2114b90045c8893d02d6446fabb0',
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
            let topFive = topTracks.map((data) => {
                return {
                    song: data.name,
                    artist: data.artists[0].name
                }
            });
            res.json(topFive);
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
