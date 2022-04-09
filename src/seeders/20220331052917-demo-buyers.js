/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('Buyers', [
      {
        name: 'Buyer One',
        phone: '081122334455',
        email: 'fakebuyer1@gmail.com',
        zip: '40415',
        address: 'Cihapit No.28',
        city: 'Bandung',
        country: 'Indonesia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Buyer Two',
        phone: '081122334456',
        email: 'fakebuyer2@gmail.com',
        zip: '40415',
        address: 'Cihapit No.28',
        city: 'Bandung',
        country: 'Indonesia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Buyer Three',
        phone: '081122334457',
        email: 'fakebuyer3@gmail.com',
        zip: '40415',
        address: 'Cihapit No.28',
        city: 'Bandung',
        country: 'Indonesia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Buyers', null, {}),
}
