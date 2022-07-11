const { Playlist } = require('../models');

const playlistData = [
    {
        id: 1,
        username: 'TKAndrew',
        link: 'https://open.spotify.com/playlist/7KqhX8pUrhnMp6RMt2HEMz?si=7062ee561ab54584',
    }
];

const seedPlaylists = () => Playlist.bulkCreate(playlistData);

module.exports = seedPlaylists;