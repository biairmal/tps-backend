/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('Users', [
      {
        username: 'seededuser1',
        password: 'seededuser',
        firstName: 'Distributor',
        lastName: 'One',
        role: 'distributor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser2',
        password: 'seededuser',
        firstName: 'Admin',
        lastName: 'One',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser3',
        password: 'seededuser',
        firstName: 'Admin',
        lastName: 'Two',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser4',
        password: 'seededuser',
        firstName: 'Dealer',
        lastName: 'One',
        role: 'dealer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'seededuser5',
        password: 'seededuser',
        firstName: 'Dealer',
        lastName: 'Two',
        role: 'dealer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
}
