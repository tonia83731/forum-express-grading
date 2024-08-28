const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized'
      })
    }
    // console.log("user authenticated", user.toJSON());
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  //   console.log(req.user);
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({
    status: 'error',
    message: 'permission denied'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}