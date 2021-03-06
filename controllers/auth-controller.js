const User = require('../models/User')
const bcrypt = require('bcrypt')
const jsonToken = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const POST_signup = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { username, email, password } = req.body
  try {
    const hashedpassword = await bcrypt.hash(password, 12)
  
    const user = new User({ username, email, password: hashedpassword, posts: [] })
    await user.save()
  
    res.status(201).json({ message: "User created!" })
  } catch(error) {
    console.log(error)
  }
}

const POST_login = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    const user_id = user._id.toString()
  
    const token = jsonToken.sign({ user_id, email }, 'supersecretstring', { expiresIn: '1h' })
  
    res.status(200).json({ token, user_id, message: 'Successfully Authenticated!' })
  } catch(error) {
    console.log(error)
  }
}

module.exports = { POST_signup, POST_login }