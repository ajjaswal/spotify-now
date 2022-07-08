const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create playlist model
class Playlist extends Model{}

Playlist.init();

module.exports = Playlist;