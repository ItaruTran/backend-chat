import { parseJWT } from '#connector/auth.js'
import { UnauthorizedError } from '#utils/error.js'

/** @type {import('fastify').preHandlerAsyncHookHandler} */
export async function securityHandler(req, _, __) {
  if (!req.headers['authorization']) {
    return false
  }

  try {
    const [type, accessToken] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      const info = parseJWT(accessToken);

      req.userId = info.sub;
      req.tokenInfo = info

      return true;
    }

    return false;
  } catch (error) {
    console.error(error.message);

    throw new UnauthorizedError('Token invalid')
  }
}
