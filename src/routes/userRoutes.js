const { Router } = require('express')
const { userController } = require('../controllers')
const { checkRole, validateRequestSchema } = require('../middlewares')
const { userSchema } = require('../validations')

const router = Router()

router
  .route('/users')
  .post(
    checkRole('distributor'),
    userSchema.createUserSchema,
    validateRequestSchema,
    userController.createUser
  )
  .get(checkRole('distributor'), userController.getUsers)

router
  .route('/users/:id')
  .get(checkRole('distributor'), userController.getUserById)
  .delete(checkRole('distributor'), userController.deleteUserById)
  .put(
    checkRole('distributor'),
    userSchema.updateUserSchema,
    validateRequestSchema,
    userController.updateUserById
  )

module.exports = router
