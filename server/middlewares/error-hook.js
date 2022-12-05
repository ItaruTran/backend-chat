import { stage } from '#sv/env.js'

/** @type {Parameters<import('#lib/fastify.js').default['setNotFoundHandler']>[1]} */
export function notFoundHandler(_, res) {
  res.status(404).send({
    success: false,
    message: 'Endpoint doesnt exist',
    type: 'NotFoundError',
  })
}

/** @type {import('#lib/fastify.js').default['errorHandler']} */
export function errorHandler(err, req, reply) {
  if (
    err.name === 'TokenExpiredError' ||
    err.errorCode === 'authentication.openapi.security'
  )
    console.error(err.message)
  else
    console.error(err.stack || err)

  let status = err.statusCode || 500
  if (err.name === 'SequelizeUniqueConstraintError')
    status = 422

  if (err.validationContext) {
    status = 422
    err.name = 'ValidationError'
  }

  reply.status(status).send({
    success: false,
    message: err.message,
    type: err.name,
    data: err.data,
    stack: stage === 'development' ? err.stack : undefined
  })
}
