const{ Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create user model
class User extends Model{}

User.init(
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
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);
module.exports = User;