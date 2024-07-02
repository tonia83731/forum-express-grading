const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminService = {
  getRestaurants: async (req, res, cb) => {
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
  postRestaurant: async (req, res, cb) => {},
  editRestaurant: async (req, res, cb) => {},
  putRestaurant: async (req, res, cb) => {},
  deleteRestaurant: async (req, res, cb) => {},
  getUser: async (req, res, cb) => {},
  patchUser: async (req, res, cb) => {}
}
module.exports = adminService
