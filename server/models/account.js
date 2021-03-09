'use strict';

const { disableUserMethod, removeGlobalMethod } = require("@utils/disable-method");

module.exports = function(Account) {
  removeGlobalMethod(Account)
  disableUserMethod(Account)
};
