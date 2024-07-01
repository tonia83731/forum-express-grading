const { Restaurant, Category, Comment, User } = require('../../models')
// const { getOffset, getPagination } = require("../../helpers/pagination-helper");
// ("../../helpers/pagination-helper");
const restaurantService = require('../../services/restaurant-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantService.getRestaurants(req, res, (err, data) =>
      err ? next(err) : res.render('restaurants', data)
    )
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        // raw: true,
        // nest: true,
        include: [
          Category,
          {
            model: Comment,
            include: User
          },
          {
            model: User,
            as: 'FavoritedUser'
          }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUser.some(
        f => f.id === req.user.id
      )
      // console.log(increment);
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited
      })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    // return res.render("dashboard");
    try {
      const id = req.params.id
      const [restaurant, comments] = await Promise.all([
        Restaurant.findByPk(id, {
          raw: true,
          nest: true,
          include: Category
        }),
        Comment.findAndCountAll({
          nest: true,
          where: { restaurantId: id }
        })
      ])
      console.log(restaurant)
      // console.log(comments);
      const commentCounts = comments.count
      // const restaurant = await Restaurant.findByPk(id, {
      //   raw: true,
      //   nest: true,
      //   include: Category
      // })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', {
        viewCounts: restaurant.viewCounts,
        commentCounts
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

      res.render('feeds', {
        restaurants,
        comments
      })
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurantsData = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUser' }]
      })
      const restaurants = restaurantsData
        .map(rest => ({
          ...rest.toJSON(),
          description: rest.description.substring(0, 50),
          favoritedCount: rest.FavoritedUser.length,
          isFavorited:
            req.user &&
            req.user.FavoritedRestaurants.some(f => f.id === rest.id)
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      // console.log(restaurants);
      res.render('top-restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
