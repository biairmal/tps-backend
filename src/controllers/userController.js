const userServices = require('../services/userServices')

exports.createUser = async (req, res) => {
  // console.log(req)
  try {
    
    const user = req.body

    const data = await userServices.createUser(user)

    res.status(201).json({
      success: true,
      message: 'Successfully created user!',
      data,
    })
  } catch (err) {
    res.sendStatus(500)
  }
}

exports.getUsers = async () => {}
