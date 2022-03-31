const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'createdBy' })
    }
  }
  Item.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      picture: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cogs: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      normalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      dealerPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Item',
    }
  )
  return Item
}
