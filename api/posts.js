const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const { GET_fetchPosts, POST_createPost } = require('../controllers/posts-controller')

router.get('/posts', GET_fetchPosts)
router.post('/create-post', 
  check('title', 'Title must be min 5 characters long!').isLength({ min: 5 }),
  POST_createPost
)

module.exports = { postsRoutes: router }