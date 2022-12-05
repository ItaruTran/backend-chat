import jwt from 'jsonwebtoken';
import { secretKey } from '#sv/env.js'

/**
 * @param {string} token
 * @returns {import('#t/auth').TokenInfo}
 */
export function parseJWT(token) {
  return jwt.verify(token, secretKey);
}

export function createJWT(payload) {
  return jwt.sign(payload, secretKey, {
    expiresIn: '7d'
  })
}
