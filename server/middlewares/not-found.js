
module.exports = app => {
  /** catch 404 and forward to error handler */
  app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
  });
}
