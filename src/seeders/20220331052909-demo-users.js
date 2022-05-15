/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash('seededuser', salt)

    return queryInterface.bulkInsert('Users', [
      {
        username: 'seededuser1',
        password,
        firstName: 'Distributor',
        lastName: 'One',
        role: 'distributor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser2',
        password,
        firstName: 'Admin',
        lastName: 'One',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser3',
        password,
        firstName: 'Admin',
        lastName: 'Two',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser4',
        password,
        firstName: 'Dealer',
        lastName: 'One',
        role: 'dealer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser5',
        password,
        firstName: 'Dealer',
        lastName: 'Two',
        role: 'dealer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },
  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
}
