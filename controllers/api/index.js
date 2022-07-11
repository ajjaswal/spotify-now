const router = require('express').Router();

const userRoutes = require('./user-routes');
const playlistRoutes = require('./playlist-routes');
const spotifyRoutes = require('./spotify-routes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/spotify', spotifyRoutes);

module.exports = router;