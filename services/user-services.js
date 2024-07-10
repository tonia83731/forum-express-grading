const bcrypt = require('bcryptjs')
const {
  User,
  Comment,
  Restaurant,
  Favoirte,
  Followship
} = require('../models')

const userService = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match!')
      }

      const user = await User.findOne({
        where: { email }
      })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        password: hash
      })
      cb(null, { user: newUser })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = userService
