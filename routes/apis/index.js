const express = require('express')
const router = express.Router()
const {
  authenticated,
  authenticatedAdmin
} = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const restaurantController = require('../../controllers/restaurant-controller')
const commentController = require('../../controllers/comment-controller')
const upload = require('../../middleware/multer')
// const passportAuth = require('../../helpers/passportAuthenticate')
const passport = require('../../config/passport')
// const passport = require("../../config/passport");
const admin = require('./modules/admin')
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get(
  '/restaurants/top',
  authenticated,
  restaurantController.getTopRestaurants
)
router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restaurantController.getDashboard
)
router.get(
  '/restaurants/:id',
  authenticated,
  restaurantController.getRestaurant
)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.delete(
  '/comments/:id',
  authenticated,
  authenticatedAdmin,
  commentController.deleteComment
)
router.post('/comments', authenticated, commentController.postComment)
router.post('/favorite/:restId', authenticated, userController.addFavorite)
router.delete(
  '/favorite/:restId',
  authenticated,
  userController.removeFavorite
)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  userController.putUser
)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/signup', userController.signUp)
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)

router.use('/', apiErrorHandler)

module.exports = router
