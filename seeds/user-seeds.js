const { User } = require('../models');

const userData = [
    {
        id: 1,
        name: 'andrew'
    },
    {
        id: 2,
        name: 'chris'
    },
    {
        id: 3,
        name: 'aj'
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;