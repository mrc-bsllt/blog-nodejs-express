const path = require('path')
const express = require('express')

// MongoDb connection
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://mrc-bsllt:marcodevelon@cluster0.slrwb.mongodb.net/blog'

// Con questo posso estrarre le immagini che mi arrivano tramite il body della request
const multer = require('multer') 
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'storage/images')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() +  '-' + file.originalname)
  }
}) 
const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const app = express()
const bodyParser = require('body-parser')

// IMPORT API ---------------------------------------------- 
const { postsRoutes } = require('./api/posts')
const { authRoutes } = require('./api/auth')

// GENERAL MIDDLEWARE ----------------------------------------------
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})
app.use(multer({ storage: fileStorage, fileFilter }).single('image_url'))
// Con questo middleware espongo la mia cartella delle immagini per il FE, che riesce così a prendersi il path delle immagini (es. http://localhost:8080/storage/images/laptop.jpeg)
app.use('/storage/images', express.static(path.join(__dirname, 'storage/images')))

// API MIDDLEWARE ----------------------------------------------
app.use('/api', postsRoutes)
app.use('/api/auth', authRoutes)

mongoose.connect(`${MONGODB_URI}?retryWrites=true&w=majority`).then(() => {
  app.listen(8080)
}).catch(error => console.log(error))