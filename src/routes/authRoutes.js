const { Router } = require('express')
const { checkRole } = require('../middlewares')
const { userServices } = require('../services')
const response = require('../utils/response')
const passport = require('../utils/passport')

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    const data = {
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    }
    return response.success(res, data, 'Log in success!')
  }
)

router.post('/logout', (req, res) => {
  req.logout()

  return response.success(res, undefined, 'Log out success!')
})

router.post(
  '/profile/edit',
  checkRole(['distributor', 'admin', 'dealer']),
  async (req, res) => {
    try {
      const data = await userServices.updateProfile(req.user.id, req.body)

      if (!data) return response.not_found(res, undefined, 'User not found!')

      if (data === 204) return response.no_content(res, 'Nothing is updated!')

      return response.success(res, data, 'Successfully updated profile!')
    } catch (error) {
      console.log(error)

      return response.internal_server_error(
        res,
        undefined,
        'Failed to update profile!'
      )
    }
  }
)

module.exports = router
