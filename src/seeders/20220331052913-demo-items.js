/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users"`)
    const userId = users[0][0].id

    return queryInterface.bulkInsert('Items', [
      {
        code: 'AAA001',
        name: 'Item 1',
        description: 'This item is cool.',
        picture: 'http://cdn.onlinewebfonts.com/svg/img_137275.png',
        quantity: 20,
        cogs: '100000.00',
        normalPrice: '140000.00',
        dealerPrice: '125000.00',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'AAA002',
        name: 'Item 2',
        description: 'This item is cool.',
        picture: 'http://cdn.onlinewebfonts.com/svg/img_137275.png',
        quantity: 10,
        cogs: '180000.00',
        normalPrice: '220000.00',
        dealerPrice: '200000.00',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'AAA003',
        name: 'Item 3',
        description: 'This item is cool.',
        picture: 'http://cdn.onlinewebfonts.com/svg/img_137275.png',
        quantity: 5,
        cogs: '300000.00',
        normalPrice: '360000.00',
        dealerPrice: '335000.00',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'AAA004',
        name: 'Item 4',
        description: 'This item is cool.',
        picture: 'http://cdn.onlinewebfonts.com/svg/img_137275.png',
        quantity: 50,
        cogs: '50000.00',
        normalPrice: '70000.00',
        dealerPrice: '58000.00',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Items', null, {}),
}
