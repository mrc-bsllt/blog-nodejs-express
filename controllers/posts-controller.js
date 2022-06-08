const Post = require('../models/Post')

const GET_fetchPosts = (req, res, next) => {
  const test = [{ title: 'Primo' }, { title: 'Secondo' }]

  res.status(200).json(test)
}

const POST_createPost = (req, res, next) => {
  const { title, image_url, content, author } = req.body
  const created_at = new Date()
  const updated_at = new Date()
  const post = new Post({ title, image_url, content, author, created_at, updated_at })
  post.save().then(post => {
    res.status(200).json({ message: 'post created', post })
  }).catch(error => console.log(error))
}

module.exports = { GET_fetchPosts, POST_createPost }