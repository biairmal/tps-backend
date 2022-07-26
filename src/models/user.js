/* eslint-disable no-param-reassign */
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM(['distributor', 'admin', 'dealer']),
        allowNull: false,
        defaultValue: 'dealer',
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['password'] },
        order: [
          ['createdAt', 'DESC'],
          ['username', 'ASC'],
        ],
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  )

  User.beforeCreate(async (user) => {
    const hashedPassword = await hashPassword(user.password)
    user.password = hashedPassword
  })

  User.beforeUpdate(async (user) => {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password)
      user.password = hashedPassword
    }
  })

  return User
}
