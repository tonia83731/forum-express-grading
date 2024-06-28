const { Category } = require('../../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', { categories, category })
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      await Category.create({
        name
      })
      req.flash('success_messages', 'category was successfully created')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const id = req.params.id
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(id)
      if (!category) throw new Error("Category doesn't exist!")
      await category.update({
        name
      })
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const id = req.params.id
      const category = await Category.findByPk(id)
      if (!category) throw new Error("Category didn't exist!")
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
