const { Router } = require('express')
const { userController } = require('../controllers')
const { validateRequestSchema } = require('../middlewares')
const { userSchema } = require('../validations')

const router = Router()

router
  .route('/users')
  .post(
    userSchema.createUserSchema,
    validateRequestSchema,
    userController.createUser
  )
  .get(userController.getUsers)

router
  .route('/users/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .put(
    userSchema.updateUserSchema,
    validateRequestSchema,
    userController.updateUserById
  )

module.exports = router
