const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite } = db
const {
  // localFileHandler,
  imgurFileHandler
} = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
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
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    if (req.user.isAdmin) return res.redirect('/admin/restaurants')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const [user, comments] = await Promise.all([
        User.findByPk(id, {
          raw: true
        }),
        Comment.findAndCountAll({
          nest: true,
          // raw: true,
          where: { userId: id },
          include: Restaurant
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      // console.log(comments);
      const restData = comments.rows
        .map(item => item.Restaurant.toJSON())
        .reduce((acc, restaurant) => {
          acc.set(restaurant.id, restaurant)
          return acc
        }, new Map())
      const restaurants = Array.from(restData.values())
      // console.log(restaurants);
      const commentCounts = comments.count
      const restCounts = restaurants.length
      res.render('profile', { user, restaurants, commentCounts, restCounts })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('edit-profile', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const name = req.body.name
      console.log(name)
      if (!name) throw new Error('User name is required!')
      const { file } = req
      const [user, filePath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(file)
      ])
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', 'user was successfully to update')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      favorite.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
