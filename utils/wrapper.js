
exports.errorWrapper = function (func) {
  return async function (req, res, next) {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
