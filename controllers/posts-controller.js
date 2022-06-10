const Post = require('../models/Post')
const User = require('../models/User')
const deleteImage = require('../utils/delete-file')
const { validationResult } = require('express-validator')

const GET_fetchPosts = (req, res, next) => {
  const limit = +req.query.limit || 2
  const page = +req.query.page || 1
  let total_items
  let total_pages
  Post.countDocuments().then(count => {
    total_items = count
    total_pages = Math.floor(total_items / limit)

    return Post.find().skip((page - 1) * limit).limit(limit)
  }).then(posts => {
    res.status(200).json({ posts, total_pages })
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

const POST_createPost = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  
  const user_id = req.user_id
  const user = await User.findById(user_id)
  
  const { title, content } = req.body
  const image_url = '/' + req.file.path
  const author = user.username
  const created_at = new Date()
  const updated_at = new Date()
  const post = new Post({ title, image_url, content, author, user_id, created_at, updated_at })

  post.save().then(post => {
    res.status(201).json({ message: 'post created', post })
  }).catch(error => console.log(error))
}

const PUT_editPost = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const post_id = req.params.post_id
  Post.findOne({ _id: post_id }).then(post => {
    if(req.file) {
      deleteImage(post.image_url)
      post.image_url = '/' + req.file.path
    }
    const { title, content } = req.body

    post.title = title
    post.content = content
    return post.save()
  }).then(post => {
    res.status(200).json({ message: 'Post updated!', post })
  }).catch(error => console.log(error))
}

const DELETE_deletePost = (req, res, next) => {
  const post_id = req.params.post_id
  Post.findOneAndDelete({ _id: post_id }).then(post => {
    deleteImage(post.image_url)
    res.status(204).json({ message: 'Post deleted!' })
  }).catch(error => console.log(error))
}

module.exports = { GET_fetchPosts, GET_singlePost, POST_createPost, PUT_editPost, DELETE_deletePost }