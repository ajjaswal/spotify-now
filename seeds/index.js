const seedPlaylists = require('./playlist-seeds');
const seedUsers = require('./user-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('--------------------');

    await seedUsers();
    console.log('--------------------');

    await seedPlaylists();
    console.log('--------------------');


    process.exit(0);
};

seedAll();