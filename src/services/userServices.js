const createError = require('http-errors')
const bcrypt = require('bcrypt')
const { User } = require('../models')

exports.createUser = async (user) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)

    let createdUser = await User.create({
      id: user.id,
      username: user.username,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })

    createdUser = createdUser.toJSON()
    delete createdUser.password

    return createdUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.getUserById = async (id) => {
  try {
    const user = await User.findByPk(id)

    if (!user) throw createError(404, 'User not found!')

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.getUsers = async (query) => {
  const options = {}

  if (query) {
    const filter = JSON.parse(JSON.stringify(query))
    if (query.limit) {
      options.limit = parseInt(query.limit, 10)
      delete filter.limit
    }
    if (query.page) {
      options.offset = parseInt(query.limit, 10) * parseInt(query.page, 10)
      delete filter.page
    }
    if (filter) options.where = filter
  }

  return User.findAll(options)
}

exports.updateUserById = async (id, dataToUpdate) => {
  try {
    const user = await User.findByPk(id)

    if (!user) throw createError(404, 'User not found!')

    const updatedUser = await user.update(dataToUpdate)

    return updatedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.deleteUserById = async (id) => {
  try {
    const result = {}
    const user = await User.findByPk(id)

    if (!user) throw createError(404, 'User not found!')

    const deletedRow = await User.destroy({ where: { id } })
    if (deletedRow > 0) result.deletedUsername = user.username

    return result
  } catch (error) {
    console.log(error)
    throw error
  }
}
