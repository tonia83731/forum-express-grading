const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminService = {
  getRestaurants: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      // console.log(restaurants);
      //   res.render("admin/restaurants", { restaurants });
      return cb(null, { restaurants })
    } catch (error) {
      cb(error)
    }
  },
  getRestaurant: async (req, res, cb) => {},
  createRestaurant: async (req, res, cb) => {},
  postRestaurant: async (req, cb) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const filepath = await imgurFileHandler(file)
      const newRestaurant = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filepath || null,
        categoryId
      })
      cb(null, { restaurant: newRestaurant })
    } catch (error) {
      cb(error)
    }
  },
  editRestaurant: async (req, res, cb) => {},
  putRestaurant: async (req, res, cb) => {},
  deleteRestaurant: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const deletedRestaurant = await restaurant.destroy()
      cb(null, { restaurant: deletedRestaurant })
    } catch (error) {
      cb(error)
    }
  },
  getUser: async (req, res, cb) => {},
  patchUser: async (req, res, cb) => {}
}
module.exports = adminService
