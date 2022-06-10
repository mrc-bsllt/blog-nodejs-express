const jsonToken = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // Prendo il token dai cookie (che il FE dovrebbe aver salvato)
  const token = req.get('Authorization').split(' ')[1]

  // Provo a decodificare il token per controlalre che esista
  let decodedToken = null
  try {
    decodedToken = jsonToken.verify(token, 'supersecretstring')
  } catch(error) {
    error.statusCode = 500
    throw error
  }

  // Se il token non esiste, lancio un errore, in caso contrario salvo lo user
  if(!decodedToken) {
    const error = new Error('Not authorized!')
    error.statusCode = 401
    throw error
  }

  req.user_id = decodedToken.user_id
  next()
}