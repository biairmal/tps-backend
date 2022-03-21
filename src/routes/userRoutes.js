const { Router } = require('express')
const validateRequestSchema = require('../middlewares/validateRequestSchema')
const userSchema = require('../validations/userSchema')
const userController = require('../controllers/userController')

const router = Router()

router.route('/user')
    .post(userSchema.createUserSchema, validateRequestSchema, userController.createUser)
    .get(userController.getUsers)

module.exports = router