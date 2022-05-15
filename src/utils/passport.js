const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.scope('withPassword').findOne({
        where: { username },
      })

      if (!user) return cb(null, false)

      const passwordMatch = await bcrypt.compare(password, user.password)

      // If the entered password does not match
      if (!passwordMatch) {
        return cb(null, false)
      }

      // Returns user if password match
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  })
)

passport.serializeUser((user, cb) => cb(null, user.id))

passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err))
})

module.exports = passport
