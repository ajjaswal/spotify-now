const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our db
// set up for local database. will need to be changed to jawsdb when deployed to heroku
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3001
});

module.exports = sequelize;