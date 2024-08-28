const passport = require('../config/passport')
const passportAuthenticate = cb => {
  const hack = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Incorrect email or password.'
        })
      }
      // console.log("user", user);

      req.user = user
      return cb(req, res, next)
    })(req, res, next)
  }
  return hack
}

module.exports = passportAuthenticate
