const Post = require('../models/Post')
const { validationResult } = require('express-validator')

const GET_fetchPosts = (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({ posts })
  }).catch(error => console.log(error))
}

const GET_singlePost = (req, res, next) => {
  const post_id = req.params.post_id
  Post.findOne({ _id: post_id }).then(post => {
    res.status(200).json({ post })
  }).catch(error => {
    res.status(404).json({ message: error.message })
  })
}

const POST_createPost = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // const user_id = req.user._id
  const { title, image_url, content, author } = req.body
  const created_at = new Date()
  const updated_at = new Date()
  const post = new Post({ title, image_url, content, author, created_at, updated_at })

  post.save().then(post => {
    res.status(201).json({ message: 'post created', post })
  }).catch(error => console.log(error))
}

module.exports = { GET_fetchPosts, GET_singlePost, POST_createPost }