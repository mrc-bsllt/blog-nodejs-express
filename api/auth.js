const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { check } = require('express-validator')
const bcrypt = require('bcrypt')

const { POST_signup, POST_login } = require('../controllers/auth-controller')

router.post('/signup', [
  check('username', 'Must be 5 character long!').isLength({ min: 5 }),
  check('email', 'Insert a valid email!')
    .isEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if(user) {
        return Promise.reject('Email already exist!')
      } else {
        return true
      }
    }),
  check('password', 'Invalid password!').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
], POST_signup)

router.post('/login', [
  check('email')
    .isEmail().withMessage('Incorrect Email!').bail()
    .custom(async (email) => {
      const user = await User.findOne({ email })

      if(!user) {
        return Promise.reject('Email does not exist!')
      } else {
        return true
      }
    }),
  check('password').custom(async (password, { req }) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    const is_valid = await bcrypt.compare(password, user.password)
    if(!is_valid) {
      return Promise.reject('Invalid password!')
    }
  })
], POST_login)
module.exports = { authRoutes: router }