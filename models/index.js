// import all models
const Playlist = require('./playlist');
const User = require('./user');

User.hasMany(Playlist, {
    foreignKey: 'user_id'
});