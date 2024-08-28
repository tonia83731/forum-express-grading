const { Restaurant, User, Category } = require('../models')
const { imageFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const rests = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })

      // const rest = restaurants.toJSON();
      const restaurants = rests.map(item => {
        return {
          ...item,
          categoryName: item.Category.text,
          Category: undefined
        }
      })

      return res.status(201).json({ status: 'success', restaurants })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, {
        raw: true
      })
      if (!restaurant) {
        res.status(400).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
        return
      }
      return res.status(201).json({
        status: 'success',
        restaurant
      })
    } catch (error) {
      next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      const { file } = req
      if (!name) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Restaurant name is required!' })
      }
      if (!categoryId) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Category is required!' })
      }
      const filePath = await imageFileHandler(file)
      const newRest = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })
      return res.status(201).json({ status: 'success', restaurant: newRest })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      const { file } = req
      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(restId),
        imageFileHandler(file)
      ])
      if (!restaurant) {
        res.status(404).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
        return
      }
      if (!name) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Restaurant name is required!' })
      }
      if (!categoryId) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Category is required!' })
      }
      const editRest = await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath | restaurant.image,
        categoryId
      })
      return res.status(201).json({ status: 'success', restaurant: editRest })
    } catch (error) {
      next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId)
      if (!restaurant) {
        res.status(400).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
        return
      }
      const deleteRest = await restaurant.destroy()
      return res
        .status(201)
        .json({ status: 'success', restaurant: deleteRest })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
      })
      const userData = users.map(user => {
        return { ...user, password: undefined }
      })
      return res.status(201).json({ status: 'success', users: userData })
    } catch (error) {
      next(error)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: "User didn't exist!"
        })
      }
      if (user.email === 'root@example.com') {
        return res.status(403).json({
          status: 'error',
          message: 'forbidden'
        })
      }
      const editAdmin = await user.update({
        isAdmin: !user.isAdmin
      })
      return res.status(201).json({ status: 'success', user: editAdmin })
    } catch (error) {
      next(error)
    }
  },
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      return res.status(201).json({
        status: 'success',
        categories
      })
    } catch (error) {
      next(error)
    }
  },
  getCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findByPk(categoryId, {
        raw: true
      })
      if (!category) {
        return res.status(401).json({
          status: 'error',
          message: "Category didn't exist!"
        })
      }
      return res.status(201).json({
        status: 'success',
        category
      })
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { text } = req.body
      if (!text) {
        return res.status(401).json({
          status: 'error',
          message: 'Text is required!'
        })
      }
      const newCategory = await Category.create({
        text
      })
      return res.status(201).json({ status: 'success', category: newCategory })
    } catch (error) {
      next(error)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { text } = req.body
      const categoryId = req.params.id
      if (!text) {
        return res.status(401).json({
          status: 'error',
          message: 'Text is required!'
        })
      }
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return res.status(401).json({
          status: 'error',
          message: "Category didn't exist!"
        })
      }
      const editCategory = await category.update({
        text
      })
      return res
        .status(201)
        .json({ status: 'success', category: editCategory })
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return res.status(401).json({
          status: 'error',
          message: "Category didn't exist!"
        })
      }
      const deleteCategory = await category.destroy()
      return res
        .status(201)
        .json({ status: 'success', category: deleteCategory })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
