const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')

passport.use(
  new LocalStrategy((username, password, cb) => {
    User.findOne({ where: { username } })
      .then((user) => {
        // If no user found
        if (!user) return cb(null, false)

        // If the entered password does not match
        if (!bcrypt.compare(password, user.password)) {
          return cb(null, false)
        }

        // Returns user if password match
        return cb(null, user)
      })
      .catch((err) => cb(err))
  })
)

passport.serializeUser((user, cb) => cb(null, user.id))

passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err))
})

module.exports = passport
