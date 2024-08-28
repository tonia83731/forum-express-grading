const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id
      if (!text) {
        return res.status(401).json({
          status: 'error',
          message: 'Comment text is required!'
        })
      }

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: "User didn't exist!"
        })
      }
      if (!restaurant) {
        return res.status(404).json({
          status: 'error',
          message: "Restaurant didn't exist!"
        })
      }
      const newComment = await Comment.create({
        text,
        restaurantId,
        userId
      })
      return res.status(201).json({
        status: 'success',
        comment: newComment
      })
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const commentId = req.params.id
      const comment = await Comment.findByPk(commentId)
      if (!comment) {
        return res.status(404).json({
          status: 'error',
          message: "Comment don't exist!"
        })
      }
      const deleteComment = await comment.destroy()
      return res.status(201).json({
        status: 'success',
        deleteComment
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
