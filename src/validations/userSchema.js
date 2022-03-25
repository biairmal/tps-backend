const { body } = require('express-validator')

const createUserSchema = [
  body('username')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('username can not be blank')
    .bail()
    .isLength({ min: 6, max: 20 })
    .withMessage('Username must be between 6-20 characters long')
    .bail()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('username can only contains alphabets and numbers'),
  body('password')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('password can not be blank'),
  body('first_name')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('first_name can not be blank'),
  body('last_name')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('last_name can not be blank'),
  body('role')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('role can not be blank'),
]

const updateUserSchema = [
  body('username')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('username can not be blank')
    .bail()
    .isLength({ min: 6, max: 20 })
    .withMessage('Username must be between 6-20 characters long')
    .bail()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('username can only contains alphabets and numbers'),
  body('password')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('password can not be blank'),
  body('first_name')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('first_name can not be blank'),
  body('last_name')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('last_name can not be blank'),
  body('role')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('role can not be blank'),
]

module.exports = { createUserSchema, updateUserSchema }
