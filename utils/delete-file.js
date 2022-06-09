const fs = require('fs')
const path = require('path')

module.exports = (imagePath) => {
  const deletePath = path.join(__dirname, '..', imagePath)
  fs.unlink(deletePath, (error) => {
    if(error) {
      throw(error)
    }
  })
} 