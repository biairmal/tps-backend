const { User } = require('../models')
const { parseSequelizeOptions, getCursorData } = require('../helpers')

exports.create = async (user) => {
  let createdUser = await User.create({
    id: user.id,
    username: user.username,
    password: user.password,
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

  const userJSON = user.toJSON()
  delete userJSON.password

  return userJSON
}

exports.updateProfile = async (id, data) => {
  const user = await User.findByPk(id)
  const updateData = data

  if (!user) return null

  if (updateData.role) delete updateData.role
  if (updateData.username) delete updateData.username

  console.log(updateData)

  if (Object.keys(updateData).length < 1) return 204

  user.set(updateData)

  await user.save()

  const userJSON = user.toJSON()

  return userJSON
}

exports.deleteById = async (id) => {
  const user = await User.findByPk(id)

  if (!user) return null

  await user.destroy()

  return true
}
