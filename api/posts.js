const express = require('express')
const router = express.Router()

const { GET_fetchPosts, POST_createPost } = require('../controllers/posts-controller')

router.get('/posts', GET_fetchPosts)
router.post('/post', POST_createPost)

module.exports = { postsRoutes: router }