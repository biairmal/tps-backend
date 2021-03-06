const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class SoldItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, { as: 'transaction' })
      this.belongsTo(models.Item, { as: 'item' })
      this.belongsTo(models.DailyReport, { foreignKey: 'dateId' })
    }
  }
  SoldItem.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priceATT: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cogsATT: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SoldItem',
    }
  )
  return SoldItem
}
