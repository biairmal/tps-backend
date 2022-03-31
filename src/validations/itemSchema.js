const { body } = require('express-validator')

const createItemSchema = [
  body('code')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('code can not be blank'),
  body('name')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('name can not be blank'),
  body('description')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('description can not be blank'),
  body('picture')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('picture can not be blank'),
  body('quantity')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('quantity can not be blank'),
  body('cogs')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('cogs can not be blank'),
  body('normalPrice')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('normalPrice can not be blank'),
  body('dealerPrice')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('dealerPrice can not be blank'),
]

module.exports = { createItemSchema }
