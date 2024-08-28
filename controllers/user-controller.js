const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  User,
  Favorite,
  Restaurant,
  Followship,
  Comment
} = require('../models')
const { imageFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUp: async (req, res) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password) {
        res.status(400).json({
          status: 'error',
          message: 'Name, email, password is required'
        })
        return
      }
      if (password !== passwordCheck) {
        res.status(400).json({
          status: 'error',
          message: 'Password, passwordCheck do not match'
        })
        return
      }
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        password: hash
      })
      delete newUser.password
      return res.status(201).json({ status: 'success', user: newUser })
    } catch (error) {
      console.log(error)
    }
  },
  signIn: async (req, res, next) => {
    try {
      // console.log(req.user);
      const userData = req.user.toJSON()
      // console.log(userData);
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      }) // 簽發 JWT，效期為 30 天
      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      // res.stauts(400).json({
      //   status: "error",
      //   message: err,
      // });
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      // console.log(req.user.id);
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          Comment,
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Cannot find user!'
        })
      }
      const userJSON = user.toJSON()
      const userData = {
        ...userJSON,
        commentsCount: userJSON.Comments.length,
        favoriteRestCount: userJSON.FavoritedRestaurants.length,
        followersCount: userJSON.Followers.length,
        followingsCount: userJSON.Followings.length
      }
      delete userData.password
      return res.status(201).json({
        status: 'success',
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      // console.log(req.user);
      // console.log(typeof req.user.id, typeof userId);
      if (req.user.id !== +userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Permission denied!'
        })
      }
      const { name } = req.body
      const { file } = req
      if (!name) {
        return res
          .status(401)
          .json({ status: 'error', message: 'User name is required!' })
      }
      const user = await User.findByPk(userId)
      if (!user) {
        return res
          .status(404)
          .json({ status: 'error', message: "User don't exist!" })
      }
      const filePath = await imageFileHandler(file)
      const editUser = await user.update({
        name,
        image: filePath | user.image
      })
      return res.status(201).json({
        status: 'success',
        user: editUser
      })
    } catch (error) {
      next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId: restId
          }
        })
      ])

      if (!restaurant) {
        return res.status(404).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
      }
      if (favorite) {
        return res.status(401).json({
          status: 'error',
          message: 'You have favorited this restaurant!'
        })
      }
      const favorited = await Favorite.create({
        userId: req.user.id,
        restaurantId: +restId
      })
      return res.status(201).json({
        status: 'success',
        favorite: favorited
      })
    } catch (error) {
      next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restId } = req.params
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: +restId
        }
      })
      if (!favorite) {
        return res.status(401).json({
          status: 'error',
          message: "You haven't favorited this restaurant!"
        })
      }
      const removeFavorite = await favorite.destroy()
      return res.status(201).json({
        status: 'success',
        favorite: removeFavorite
      })
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: User,
            as: 'Followers'
          }
        ]
      })
      let usersData = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      }))
      usersData = usersData.sort((a, b) => b.followerCount - a.followerCount)
      return res.status(201).json({
        status: 'success',
        users: usersData
      })
    } catch (error) {
      next(error)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: req.user.id, followingId: userId }
        })
      ])
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: "User didn't exist!"
        })
      }
      if (followship) {
        return res.status(401).json({
          status: 'error',
          message: 'You are already following this user!'
        })
      }
      const following = await Followship.create({
        followerId: req.user.id,
        followingId: +userId
      })
      return res.status(201).json({
        status: 'success',
        following
      })
    } catch (error) {
      next(error)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: +userId
        }
      })
      if (!followship) {
        return res.status(401).json({
          status: 'error',
          message: "You haven't followed this user!"
        })
      }
      const removeFollow = await followship.destroy()
      return res.status(201).json({
        status: 'success',
        removeFollow
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
