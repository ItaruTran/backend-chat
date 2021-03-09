'use strict';
const { Model } = require("loopback");

/**
 * @param {typeof Model} model
 * @param {{
 *   keepDel?: boolean,
 *   keepCreate?: boolean,
 *   keepCount?: boolean,
 * }} [opt]
 */
exports.removeGlobalMethod = (model, opt = {}) => {
  model.disableRemoteMethodByName('patchOrCreate')
  model.disableRemoteMethodByName('replaceOrCreate')
  model.disableRemoteMethodByName('replaceById')
  if (!opt.keepDel) model.disableRemoteMethodByName('deleteById')
  model.disableRemoteMethodByName('updateAll')
  if (!opt.keepCount) model.disableRemoteMethodByName('count')
  model.disableRemoteMethodByName(`createChangeStream`)
  model.disableRemoteMethodByName(`exists`)
  model.disableRemoteMethodByName('upsertWithWhere')
  model.disableRemoteMethodByName('findOne')
  if (!opt.keepCreate) model.disableRemoteMethodByName('create')
}

/**
 * @param {typeof Model} model
 */
exports.disableUserMethod = (model) => {
  model.disableRemoteMethodByName('setPassword')

  model.disableRemoteMethodByName("prototype.__findById__accessTokens");
  model.disableRemoteMethodByName("prototype.__destroyById__accessTokens");
  model.disableRemoteMethodByName("prototype.__updateById__accessTokens");
  model.disableRemoteMethodByName("prototype.__get__accessTokens");
  model.disableRemoteMethodByName("prototype.__create__accessTokens");
  model.disableRemoteMethodByName("prototype.__delete__accessTokens");
  model.disableRemoteMethodByName("prototype.__count__accessTokens");

  model.disableRemoteMethodByName("prototype.__destroyById__roles");
  model.disableRemoteMethodByName("prototype.__updateById__roles");
  model.disableRemoteMethodByName('prototype.__get__roles');
  model.disableRemoteMethodByName("prototype.__create__roles");
  model.disableRemoteMethodByName("prototype.__findById__roles");
  model.disableRemoteMethodByName("prototype.__delete__roles");
  model.disableRemoteMethodByName("prototype.__count__roles");
  model.disableRemoteMethodByName("prototype.__link__roles");
  model.disableRemoteMethodByName("prototype.__unlink__roles");
  model.disableRemoteMethodByName("prototype.__exists__roles");

  model.disableRemoteMethodByName('prototype.verify')
  model.disableRemoteMethodByName('confirm')
}
