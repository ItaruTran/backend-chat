const { removeGlobalMethod } = require("@utils/disable-method")

module.exports = function (Model) {
  removeGlobalMethod(Model, {
    keepCreate: true,
  })
}
