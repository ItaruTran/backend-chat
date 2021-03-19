import { createHash } from "crypto";

/**
 * @param {string} password
 * @returns {string}
 */
export function hashPassword(password) {
  return createHash('md5').update(password).digest('base64')
}
