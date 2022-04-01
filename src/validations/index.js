/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)

const validations = {}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const validation = require(path.join(__dirname, file))
    const validationName = file.slice(0, -3)

    validations[validationName] = validation
  })

module.exports = validations
