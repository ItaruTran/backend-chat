'use strict'

/**
 * @param {Function} func
 * @param  {...any} args
 */
exports.promiseWrapper = (func, ...args) => new Promise((res, rej) => {
  func(...args, (err, result) => {
    if (err) return rej(err)

    res(result)
  })
})
