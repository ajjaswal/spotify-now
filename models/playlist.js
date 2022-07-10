const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create playlist model
class Playlist extends Model{}

Playlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'playlist'
    }
);

module.exports = Playlist;