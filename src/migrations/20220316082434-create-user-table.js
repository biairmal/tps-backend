const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Users',
      {
        id: {
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        username: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true,
        },
        first_name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        last_name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        role: {
          allowNull: false,
          defaultValue: 'dealer',
          type: DataTypes.ENUM(['distributor','admin','dealer']),
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.DATE
        },
      },
    ),
  down: async (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
}
