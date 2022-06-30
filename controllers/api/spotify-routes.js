const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const token ="BQDUYpDw29r9Nn5GG1vacf5EIYHHXhh1DlxC4pvyUKR7yffLO8LPi1KVYdoJtypBdG3KfA9eX7qy8-HlkcbIGjqboERt04ZQKDGLDT4n8tgHiPJTw6YHbQj__y0ehkaad-N8TQaS6CD5zxr_leGMtkvzg7GxxTrypgZ8Pkp5jWvLanEqvF1D8GoyNXY5ylAn0YMiWsVQCpSiIGhGHsRSTNSTXMabZCisIEASgDsrnIFMcwiy-6p0XBlgwYTMJ5mWwh-yyl7s0YjJWB689bzpHzIxBzAwj9bems9_KNvq1Bvjmpe0G49-oL8QM--ppoJ39Iui__g";

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
