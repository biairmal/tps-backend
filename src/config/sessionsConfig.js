const randomString = require('randomstring')

function sessionConfig(sessionStore) {
  return {
    store: sessionStore,
    name: 'SID',
    secret: randomString.generate({
      length: 14,
      charset: 'alphanumeric',
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
      // secure: true, // ENABLE ONLY ON HTTPS
    },
  }
}

module.exports = sessionConfig
