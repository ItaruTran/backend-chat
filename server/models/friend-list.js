const { removeGlobalMethod, disableRelationMethod } = require("@utils/disable-method")
const mountApi = require("@utils/mount-api")

module.exports = function (Model) {
  removeGlobalMethod(Model, {
    removeUpdate: true,
    removeFindById: true,
  })
  disableRelationMethod(Model, 'messages')
  Model.disableRemoteMethodByName('prototype.__get__user1')
  Model.disableRemoteMethodByName('prototype.__get__user2')

  mountApi(Model, 'api/friend-list')
}
