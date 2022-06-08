const path = require('path')
const express = require('express')
// MongoDb connection
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://mrc-bsllt:marcodevelon@cluster0.slrwb.mongodb.net/blog'

const app = express()
const bodyParser = require('body-parser')

// ---------------------------------------------- IMPORT API
const { postsRoutes } = require('./api/posts')

// ---------------------------------------------- GENERAL MIDDLEWARE
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})
// Con questo middleware espongo la mia cartella delle immagini per il FE, che riesce così a prendersi il path delle immagini (es. http://localhost:8080/storage/images/laptop.jpeg)
app.use('/storage/images', express.static(path.join(__dirname, 'storage/images')))

// ---------------------------------------------- API MIDDLEWARE
app.use('/api', postsRoutes)

mongoose.connect(`${MONGODB_URI}?retryWrites=true&w=majority`).then(() => {
  app.listen(8080)
}).catch(error => console.log(error))