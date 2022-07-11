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
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        }
    }, 
    {
        sequelize,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'playlist'
    }
);

module.exports = Playlist;