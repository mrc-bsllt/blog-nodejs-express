const express = require('express')
const router = express.Router()

const { GET_test } = require('../controllers/get')

router.get('/test', GET_test)

module.exports = { getAPI: router }