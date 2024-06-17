const { Category } = require("../models");

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true });
      res.render("admin/categories", { categories });
    } catch (error) {
      next(error);
    }
  },
  getCategory: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await Category.findBypk(id, { raw: true });
      if (!category) throw new Error("Category didn't exist!");
      res.render("admin/category", { category });
    } catch (error) {
      next(error);
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) throw new Error("Category name is required!");
      await Category.create({
        name,
      });
      req.flash("success_messages", "category was successfully created");
      res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  },
  putCategory: async (req, res, next) => {},
  deleteCategory: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await Category.findBypk(id);
      if (!category) throw new Error("Category didn't exist!");
      await category.destroy();
      res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
