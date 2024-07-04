const adminService = require('../../services/admin-services')

const adminController = {
  getRestaurants: async (req, res, next) => {
    adminService.getRestaurants(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getRestaurant: async (req, res, next) => {},
  createRestaurant: async (req, res, next) => {},
  postRestaurant: async (req, res, next) => {
    adminService.postRestaurant(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  editRestaurant: async (req, res, next) => {},
  putRestaurant: async (req, res, next) => {},
  deleteRestaurant: async (req, res, next) => {
    adminService.deleteRestaurant(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getUser: async (req, res, next) => {},
  patchUser: async (req, res, next) => {}
}

module.exports = adminController
