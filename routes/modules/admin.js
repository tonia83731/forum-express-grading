const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");

const adminController = require("../../controllers/admin-controller");
const categoryController = require("../../controllers/category-controller");
// const { authenticatedAdmin } = require('../../middleware/auth')

router.get("/users", adminController.getUser);
router.patch("/users/:id", adminController.patchUser);
router.get("/categories/:id", categoryController.getCategories); // 新增這行
router.put("/categories/:id", categoryController.putCategory); // 新增這行
router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.postCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.get("/restaurants/create", adminController.createRestaurant);
router.get("/restaurants/:id/edit", adminController.editRestaurant);
router.put(
  "/restaurants/:id",
  upload.single("image"),
  adminController.putRestaurant
);
router.delete("/restaurants/:id", adminController.deleteRestaurant);
router.post(
  "/restaurants",
  upload.single("image"),
  adminController.postRestaurant
);
router.get("/restaurants/:id", adminController.getRestaurant);
router.get("/restaurants", adminController.getRestaurants);
router.use("/", (req, res) => res.redirect("/admin/restaurants"));

module.exports = router;
