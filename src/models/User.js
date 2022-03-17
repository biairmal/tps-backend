const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    
  return super.init({
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Users_username_key"
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.ENUM("distributor","admin","dealer"),
      allowNull: false,
      defaultValue: "dealer"
    }
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Users_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  }
}

module.exports = (sequelize, DataTypes) => User.init(sequelize, DataTypes)
