const Post = require('../models/Post')
const User = require('../models/User')
const deleteImage = require('../utils/delete-file')
const { validationResult } = require('express-validator')

const GET_fetchPosts = async (req, res, next) => {
  const user_id = req.user_id
  const limit = +req.query.limit || 2
  const page = +req.query.page || 1

  try {
    const [ total_items, posts ] = await Promise.all([ 
      Post.countDocuments(), 
      Post.find({ user_id }).skip((page - 1) * limit).limit(limit) 
    ])
  
    const total_pages = Math.floor(total_items / limit)
  
    res.status(200).json({ posts, total_pages })
  } catch(error) {
    console.log(error)
  }
}

const GET_singlePost = async (req, res, next) => {
  const post_id = req.params.post_id

  try {
    const post = await Post.findOne({ _id: post_id })
    res.status(200).json({ post })
  } catch(error) {
    res.status(404).json({ message: error.message })
  }
}

const POST_createPost = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  
  try {
    const user_id = req.user_id
    const user = await User.findById(user_id)
    
    const { title, content } = req.body
    const image_url = '/' + req.file.path
    const author = user.username
    const created_at = new Date()
    const updated_at = new Date()
    const post = new Post({ title, image_url, content, author, user_id, created_at, updated_at })
  
    // associo il nuovo post al model dello user
    user.posts.push(post)
    await Promise.all([user.save(), post.save()])
    res.status(201).json({ message: 'post created', post })
  } catch(error) {
    res.status(409).json({ message: error.message })
  }
}

const PUT_editPost = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const post_id = req.params.post_id
  try {
    const post = await Post.findOne({ _id: post_id })

    if(req.file) {
      deleteImage(post.image_url)
      post.image_url = '/' + req.file.path
    }

    const { title, content } = req.body
    post.title = title
    post.content = content
    await post.save()

    res.status(200).json({ message: 'Post updated!', post })
  } catch(error) {
    res.status(400).json({ message: error.message })
  }
}

const DELETE_deletePost = async (req, res, next) => {
  const post_id = req.params.post_id

  try {
    const deletedPost = await Post.findOneAndDelete({ _id: post_id })
    const user = await User.findById(deletedPost.user_id)

    const index_deletedPost = user.posts.findIndex(post_id => post_id === deletedPost._id)
    user.posts.splice(index_deletedPost, 1)
    user.save()
    deleteImage(deletedPost.image_url)

    res.status(204).json({ message: 'Post deleted!' })
  } catch(error) {
    res.status(404).json({ message: error.message })
  }
}

module.exports = { GET_fetchPosts, GET_singlePost, POST_createPost, PUT_editPost, DELETE_deletePost }