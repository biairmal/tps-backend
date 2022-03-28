const { Router } = require('express')
const passport = require('../utils/passport')

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Log in success!',
    })
  }
)

router.post('/logout', (req, res) => {
  req.logout()

  return res.status(200).json({
    success: true,
    message: 'Log out success!',
  })
})

module.exports = router
