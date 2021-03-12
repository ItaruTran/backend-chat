const { removeGlobalMethod } = require("@utils/disable-method")
const mountApi = require("@utils/mount-api")

module.exports = function (Model) {
  removeGlobalMethod(Model, {
    keepCreate: true,
    removeUpdate: true,
    removeFindById: true,
  })

  mountApi(Model, 'api/message')
}
