'use strict';
const { Model } = require("loopback");

/**
 * @param {typeof Model} model
 * @param {{
 *   keepDel?: boolean,
 *   keepCreate?: boolean,
 *   keepCount?: boolean,
 *   removeUpdate?: boolean,
 *   removeFindById?: boolean,
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
  if (opt.removeUpdate) model.disableRemoteMethodByName('prototype.patchAttributes')
  if (opt.removeFindById) model.disableRemoteMethodByName('findById')
}

/**
 * @param {typeof Model} model
 */
exports.disableUserMethod = (model) => {
  model.disableRemoteMethodByName('setPassword')

  this.disableRelationMethod(model, 'accessTokens')

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

exports.disableRelationMethod = (model, name) => {
  model.disableRemoteMethodByName(`prototype.__findById__${name}`);
  model.disableRemoteMethodByName(`prototype.__destroyById__${name}`);
  model.disableRemoteMethodByName(`prototype.__updateById__${name}`);
  model.disableRemoteMethodByName(`prototype.__get__${name}`);
  model.disableRemoteMethodByName(`prototype.__create__${name}`);
  model.disableRemoteMethodByName(`prototype.__delete__${name}`);
  model.disableRemoteMethodByName(`prototype.__count__${name}`);
}
