const userServices = require('../services/userServices')

exports.createUser = async (req, res) => {
  try {
    const user = req.body

    const data = await userServices.createUser(user)

    if (data.errors) throw data.errors

    res.status(201).json({
      success: true,
      message: 'Successfully created user!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete user!',
      errors: errors.message,
    })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await userServices.getUserById(id)

    if (data.errors) throw data.errors

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve user!',
      errors: errors.message,
    })
  }
}

exports.getUsers = async (req, res) => {
  try {
    const data = await userServices.getUsers(req.query)

    if (data.errors) throw data.errors

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved users!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete user!',
      errors: errors.message,
    })
  }
}


exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params
    const newData = req.body

    const data = await userServices.updateUserById(id, newData)

    if (data.errors) throw data.errors
    
    res.status(200).json({
      success: true,
      message: 'Successfully updated user!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete user!',
      errors: errors.message,
    })
  }
}

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await userServices.deleteUserById(id)

    if (data.errors) throw data.errors

    res.status(200).json({
      success: true,
      message: 'Successfully deleted user!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete user!',
      errors: errors.message,
    })
  }
}
