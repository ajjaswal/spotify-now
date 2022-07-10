const seedPlaylists = require('./playlist-seeds');
const seedUsers = require('./user-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('data base synced \n');
    await seedPlaylists();
    console.log('playlists seeded \n');
    await seedUsers();
    console.log('users seeded \n')

    process.exit(0);
};

seedAll();