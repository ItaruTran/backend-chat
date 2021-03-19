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

/**
 * @param {number} ms
 */
exports.sleep = (ms) => new Promise((res, _) => {
  setTimeout(res, ms)
})
