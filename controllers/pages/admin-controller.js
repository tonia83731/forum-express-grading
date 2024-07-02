const { Restaurant, User, Category } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const adminService = require('../../services/admin-services')

const adminController = {
  getRestaurants: async (req, res, next) => {
    adminService.getRestaurants(req, res, (err, data) =>
      err ? next(err) : res.render('admin/restaurants', data)
    )
    // return res.render("admin/restaurants");
    // try {
    //   const restaurants = await Restaurant.findAll({
    //     raw: true,
    //     nest: true,
    //     include: [Category]
    //   })
    //   res.render('admin/restaurants', { restaurants })
    // } catch (error) {
    //   next(error)
    // }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      return res.render('admin/create-restaurant', { categories })
    } catch (error) {
      next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const filepath = await imgurFileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filepath || null,
        categoryId
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const [restaurant, categories] = await Promise.all([
        await Restaurant.findByPk(id, { raw: true }),
        Category.findAll({ raw: true })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      const id = req.params.id
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const [restaurant, filepath] = await Promise.all([
        Restaurant.findByPk(id),
        imgurFileHandler(file)
      ])
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filepath || restaurant.image,
        categoryId
      })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
      })
      console.log(users)
      res.render('admin/users', { users })
    } catch (error) {
      next(error)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      await user.update({
        isAdmin: !user.isAdmin
      })
      res.redirect('/admin/users')
    } catch (error) {
      next(error)
    }
  }
}
module.exports = adminController
