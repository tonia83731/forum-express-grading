const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, cb) => {
      const user = await User.findOne({ where: { email } })
      if (!user) return cb(null, false, { message: 'User not existed!' })
      const comparedPassword = await bcrypt.compare(password, user.password)
      if (!comparedPassword) {
        return cb(null, false, { message: 'incorrect email or password！' })
      }

      return cb(null, user)
    }
  )
)

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
      const user = await User.findByPk(jwtPayload.id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          {
            model: User,
            as: 'Followers'
          },
          {
            model: User,
            as: 'Followings'
          }
        ]
      })
      // console.log(user);
      cb(null, user)
    } catch (err) {
      cb(err)
    }
  })
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        {
          model: User,
          as: 'Followers'
        },
        {
          model: User,
          as: 'Followings'
        }
      ]
    })
    const userData = user.toJSON()
    return cb(null, userData)
  } catch (error) {
    console.error(error)
    return cb(error)
  }
})

module.exports = passport
