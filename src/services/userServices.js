const bcrypt = require('bcrypt')
const { User } = require('../models')
const { parseSequelizeOptions, getCursorData } = require('../helpers')

exports.create = async (user) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(user.password, salt)

  let createdUser = await User.create({
    id: user.id,
    username: user.username,
    password: hashedPassword,
    firstName: user.firstName,
    lastName: user.lastName,
    role: String(user.role).toLowerCase(),
  })

  createdUser = createdUser.toJSON()
  delete createdUser.password

  return createdUser
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  const users = await User.findAll(options)
  const cursor = await getCursorData(User, query)

  const data = {
    edge: users,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const user = await User.findByPk(id)

  if (!user) return null

  return user
}

exports.updateById = async (id, updateData) => {
  const user = await User.findByPk(id)

  if (!user) return null

  user.set(updateData)

  await user.save()

  return user
}

exports.deleteById = async (id) => {
  const user = await User.findByPk(id)

  if (!user) return null

  await user.destroy()

  return true
}
