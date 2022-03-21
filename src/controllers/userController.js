const userServices = require('../services/userServices')

exports.createUser = async (req, res) => {
  try {
    const user = req.body

    const data = await userServices.createUser(user)
    if(data.errors) throw data.errors

    res.status(201).json({
      success: true,
      message: 'Successfully created user!',
      data,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user!',
      errors: err
    })
  }
}

exports.getUsers = async () => {}
