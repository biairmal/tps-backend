const Sequelize = require('sequelize');

class SequelizeMetum extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'SequelizeMeta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "SequelizeMeta_pkey",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}

  module.exports = (sequelize, DataTypes) => SequelizeMetum.init(sequelize, DataTypes)
