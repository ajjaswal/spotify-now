const { User } = require('../models');

const userData = [
    {
        name: 'chris'
    },
    {
        name: 'andrew'
    },
    {
        name: 'aj'
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;