const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DailyReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  DailyReport.init(
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      transactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      soldItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      grossProfit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalCogs: {
        type: DataTypes.FLOAT,
        allowNull: 0,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'DailyReport',
    }
  )
  return DailyReport
}
