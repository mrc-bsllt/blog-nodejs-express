const GET_fetchPosts = (req, res, next) => {
  const test = [{ title: 'Primo' }, { title: 'Secondo' }]

  res.status(200).json(test)
}

const POST_createPost = (req, res, next) => {

}

module.exports = { GET_fetchPosts, POST_createPost }