const Post = require('../models/Post')

const GET_fetchPosts = (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({ posts })
  }).catch(error => console.log(error))
}

const POST_createPost = (req, res, next) => {
  const user_id = req.user._id
  const { title, image_url, content, author } = req.body
  const created_at = new Date()
  const updated_at = new Date()
  const post = new Post({ title, image_url, content, author, created_at, updated_at })

  post.save().then(post => {
    res.status(201).json({ message: 'post created', post })
  }).catch(error => console.log(error))
}

module.exports = { GET_fetchPosts, POST_createPost }