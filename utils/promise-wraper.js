import { promisify as promisifyLib } from "util";

/**
 * @param {Function} func
 * @param  {...any} args
 */
export function promiseWrapper(func, ...args) {
  return new Promise((res, rej) => {
    func(...args, (err, result) => {
      if (err) return rej(err)

      res(result)
    })
  });
}

/**
 * @template T
 * @param {T} obj
 * @param {keyof T} funcKey
 * @param  {...any} args
 * @returns {Promise<any>}
 */
export function promisify(obj, funcKey, ...args) {
  const func = promisifyLib(obj[funcKey]).bind(obj);
  return func(...args)
}

/**
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise((res, _) => {
    setTimeout(res, ms)
  });
}

/**
 * @template T
 * @param {Promise<T>} p
 * @returns {Promise<[T, Error]>} [data, error]
 */
export function safePromise(p) {
  return p.then(success, fail);
}

function success(data) {
  return [data, null];
}

function fail(error) {
  return [null, error];
}
