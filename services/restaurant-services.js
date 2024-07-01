const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantService = {
  getRestaurants: async (req, res, cb) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
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

      const favoritedRestaurantsId = req.user?.FavoritedRestaurants
        ? req.user.FavoritedRestaurants.map(fr => fr.id)
        : [] // 修改這裡
      const likedRestaurantsId = req.user?.LikedRestaurants
        ? req.user.LikedRestaurants.map(lr => lr.id)
        : [] // 修改這裡
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLiked: likedRestaurantsId.includes(r.id)
      }))

      return cb(null, {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = restaurantService
