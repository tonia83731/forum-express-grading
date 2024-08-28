const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // console.log(req.user);
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [rests, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: {
            ...(categoryId ? { categoryId } : {})
          },
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      const favoritedRestaurantsId =
        req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const restaurants = rests.rows.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          categoryName: r.Category.text,
          Category: undefined
        }
      })
      const pagination = getPagination(limit, page, rests.count)
      return res.status(201).json({
        status: 'success',
        data: { restaurants, categoryId, pagination, categories }
      })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const rest = await Restaurant.findByPk(restId, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' }
        ]
        // nest: true,
        // raw: true,
      })
      console.log(rest)
      if (!rest) {
        res.status(400).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
        return
      }
      await rest.increment('view_count', { by: 1 })
      const data = {
        restaurant: rest.toJSON(),
        categoryName: rest.Category.text,
        Category: undefined
      }
      return res.status(201).json({
        status: 'success',
        restaurant: data
      })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restId = req.params.id
      const rest = await Restaurant.findByPk(restId, {
        include: Comment
        // nest: true,
        // raw: true,
      })
      if (!rest) {
        return res.status(401).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
      }
      const viewCount = rest.viewCount
      const commentCount = rest.Comments.length > 0 ? rest.Comments.length : 0
      await rest.increment('view_count', { by: 1 })
      return res.status(201).json({
        status: 'success',
        data: {
          viewCount,
          commentCount
        }
      })
    } catch (error) {
      next(error)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant],
          raw: true,
          nest: true
        })
      ])
      return res.status(201).json({
        status: 'success',
        feeds: {
          restaurants,
          comments
        }
      })
    } catch (error) {
      next(error)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [
          {
            model: User,
            as: 'FavoritedUsers'
          }
        ]
      })

      // console.log(restaurants);
      const restData = restaurants
        .map(rest => {
          const favoriteCount = rest.FavoritedUsers.length
          const isFavorite = req.user.FavoritedRestaurants.some(
            f => f.id === rest.id
          )
          return {
            ...rest.toJSON(),
            favoriteCount,
            isFavorite
          }
        })
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .splice(0, 10)
      return res.status(201).json({
        status: 'success',
        restaurants: restData
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
