const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  },
  getRestaurant: async (req, res, next) => {},
  createRestaurant: async (req, res, next) => {},
  postRestaurant: async (req, res, next) => {},
  editRestaurant: async (req, res, next) => {},
  putRestaurant: async (req, res, next) => {},
  deleteRestaurant: async (req, res, next) => {}
}

module.exports = restaurantController
