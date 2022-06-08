const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  title: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Post', postSchema)