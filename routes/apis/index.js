const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controller')
const adminController = require('../../controllers/apis/admin-controller')
// const adminController = require("../../controllers/pages/admin-controller");

router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/restaurants', restController.getRestaurants)

module.exports = router
