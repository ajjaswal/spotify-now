// import all models
const User = require('./user');
const Playlist = require('./playlist');

User.hasMany(Playlist, {
    foreignKey: 'user_id'
});

Playlist.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Playlist }