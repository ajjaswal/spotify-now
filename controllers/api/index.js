const router = require('express').Router();

const playlistRoutes = require('./playlist-routes');
const spotifyRoutes = require('./spotify-routes');

router.use('/playlists', playlistRoutes);
router.use('/spotify', spotifyRoutes);

module.exports = router;