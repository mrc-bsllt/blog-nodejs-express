const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// IMPORT API
const { getAPI } = require('./api/get')

// GENERAL MIDDLEWARE
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})

// API MIDDLEWARE
app.use('/api', getAPI)

app.listen(8080)