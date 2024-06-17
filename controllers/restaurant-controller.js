const { Restaurant, Category } = require("../models");
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    // return res.render('restaurants')
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
      });
      const data = restaurants.map((r) => {
        return {
          ...r,
          description: r.description.substring(0, 50),
        };
      });
      res.render("restaurants", { restaurants: data });
    } catch (error) {
      next(error);
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = res.params.id;
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: Category,
      });
    } catch (error) {
      next(error);
    }
  },
  createRestaurant: async (req, res, next) => {},
  postRestaurant: async (req, res, next) => {},
  editRestaurant: async (req, res, next) => {},
  putRestaurant: async (req, res, next) => {},
  deleteRestaurant: async (req, res, next) => {},
};

module.exports = restaurantController;
