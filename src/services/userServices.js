const { User } = require('../models')

exports.createUser = async (user) => {
  try {
    const newUser = await User.create({
      id: user.id,
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    })
    return newUser
  } catch (err) {
    return err
  }
}
