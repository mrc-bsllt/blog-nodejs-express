const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const { GET_fetchPosts, GET_singlePost, POST_createPost, PUT_editPost, DELETE_deletePost } = require('../controllers/posts-controller')

router.get('/posts', GET_fetchPosts)
router.get('/post/:post_id', GET_singlePost)

router.post('/create-post', [
  check('title', 'Title must be min 5 characters long!').isLength({ min: 5 }),
  check('image_url').custom((_, { req }) => {
    if(req.file === undefined) {
      return Promise.reject('Image must be .png, .jpg or .jpeg')
    } else {
      return true
    }
  })
], POST_createPost
)

router.put('/post/:post_id', [
  check('title', 'Title must be min 5 characters long!').isLength({ min: 5 }),
  check('image_url').custom((_, { req }) => {
    if(!req.file && !req.body.image_url) {
      return Promise.reject('Image must be .png, .jpg or .jpeg')
    } else {
      return true
    }
  })
], PUT_editPost
)

router.delete('/delete-post/:post_id', DELETE_deletePost)
module.exports = { postsRoutes: router }