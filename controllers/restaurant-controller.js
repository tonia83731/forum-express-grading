const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    // return res.render('restaurants')
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          include: Category,
          where: {
            ...(categoryId ? { categoryId } : {})
          },
          limit,
          offset
        }),
        Category.findAll({
          raw: true
        })
      ])

      const data = restaurants.rows.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50)
        }
      })
      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        // raw: true,
        nest: true,
        include: [
          Category,
          {
            model: Comment,
            include: User
          }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      // console.log(increment);
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    // return res.render("dashboard");
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: Category
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', { viewCounts: restaurant.viewCounts })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
