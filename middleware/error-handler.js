module.exports = {
  errorHandler: (err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({
      message: 'server error'
    })
  },
  undefinedRoutes: (req, res, next) => {
    res.status(404).json({ message: 'route not found' })
  }
}
