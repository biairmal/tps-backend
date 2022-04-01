const { body } = require('express-validator')

const createBuyerSchema = [
  body('name')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('name can not be blank'),
  body('phone')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('phone can not be blank')
    .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/)
    .withMessage('please enter valid indonesian phone number'),
  body('email')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('email can not be falsy or null')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('please enter valid e-mail'),
  body('address')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('address can not be blank'),
]

const updateBuyerSchema = [
  body('name')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('name can not be blank'),
  body('phone')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('phone can not be blank')
    .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/)
    .withMessage('please enter valid indonesian phone number'),
  body('email')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('email can not be falsy or null')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('please enter valid e-mail'),
  body('address')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('address can not be blank'),
]

module.exports = { createBuyerSchema, updateBuyerSchema }
