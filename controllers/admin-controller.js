const { Restaurant } = require("../models");

const adminController = {
  getRestaurants: async (req, res, next) => {
    // return res.render("admin/restaurants");
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
      });
      res.render("admin/restaurants", { restaurants });
    } catch (error) {
      next(error);
    }
  },
  getRestaurant: async (req, res, next) => {},
  createRestaurant: async (req, res, next) => {},
  postRestaurant: async (req, res, next) => {},
  editRestaurant: async (req, res, next) => {},
  putRestaurant: async (req, res, next) => {},
  deleteRestaurant: async (req, res, next) => {},
};
module.exports = adminController;
