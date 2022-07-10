const { Playlist } = require('../models');

const playlistData = [
    {
        name: 'hip hop',
        user_id: 13
    },
    {
        name: 'rock',
        user_id: 13
    },
    {
        name: 'hits',
        user_id: 14
    }
];

const seedPlaylists = () => Playlist.bulkCreate(playlistData);

module.exports = seedPlaylists;