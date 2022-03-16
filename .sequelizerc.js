var path = require('path')

module.exports = {
  config: path.resolve('src', 'config', 'database.config.js'),
  'migrations-path': path.resolve('src', 'migrations'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
}
