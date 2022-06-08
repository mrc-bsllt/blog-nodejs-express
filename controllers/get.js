const GET_test = (req, res, next) => {
  const test = [{ title: 'Primo' }, { title: 'Secondo' }]

  res.status(200).json(test)
}

module.exports = { GET_test }