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
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
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