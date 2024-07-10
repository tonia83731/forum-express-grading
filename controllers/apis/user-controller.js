const jwt = require('jsonwebtoken')
const userService = require('../../services/user-services')
const userController = {
  signUp: async (req, res, next) => {
    userService.signUp(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  },
  signIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      console.log(process.env.JWT_SECRET)
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      await res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
