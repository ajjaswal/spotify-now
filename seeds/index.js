const seedPlaylists = require('./playlist-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('--------------------');

    await seedPlaylists();
    console.log('--------------------');


    process.exit(0);
};

seedAll();