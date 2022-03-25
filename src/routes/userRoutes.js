const { Router } = require('express')
const validateRequestSchema = require('../middlewares/validateRequestSchema')
const userSchema = require('../validations/userSchema')
const userController = require('../controllers/userController')

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
