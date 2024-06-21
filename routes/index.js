const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const upload = require('../middleware/multer')
router.use('/admin', authenticatedAdmin, admin)
// signup, signin, logout
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
) // 注意是 post
router.get('/logout', userController.logout)
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
router.get('/users/:id', userController.getUser)
router.get('/users/:id/edit', userController.editUser)
router.put('/users/:id', upload.single('image'), userController.putUser)
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)
router.post('/comments', authenticated, commentController.postComment)
// restaurants
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
