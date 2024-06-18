const { Restaurant, Category } = require("../models");
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    // return res.render('restaurants')
    try {
      const categoryId = Number(req.query.categoryId) || "";
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          raw: true,
          nest: true,
          include: Category,
          where: {
            ...(categoryId ? { categoryId } : {}),
          },
        }),
        Category.findAll({
          raw: true,
        }),
      ]);

      const data = restaurants.map((r) => {
        return {
          ...r,
          description: r.description.substring(0, 50),
        };
      });
      res.render("restaurants", { restaurants: data, categories, categoryId });
    } catch (error) {
      next(error);
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id;
      const restaurant = await Restaurant.findByPk(id, {
        // raw: true,
        nest: true,
        include: Category,
      });
      if (!restaurant) throw new Error("Restaurant didn't exist!");
      await restaurant.increment("viewCounts");
      // console.log(increment);
      res.render("restaurant", { restaurant: restaurant.toJSON() });
    } catch (error) {
      next(error);
    }
  },
  getDashboard: async (req, res, next) => {
    // return res.render("dashboard");
    try {
      const id = req.params.id;
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: Category,
      });
      if (!restaurant) throw new Error("Restaurant didn't exist!");
      return res.render("dashboard", { viewCounts: restaurant.viewCounts });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = restaurantController;
