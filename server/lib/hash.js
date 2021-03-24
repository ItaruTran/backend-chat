const { createHash } = require("crypto");

/**
 * @param {string} password
 * @returns {string}
 */
exports.hashPassword = function (password) {
  return createHash('md5').update(password).digest('base64')
}
