import fastifySwagger from '@fastify/swagger'
import Fastify from 'fastify'
import { findAllFiles } from '#utils/mount-api.js'
import { sequelize } from '#connector/db.js'
import { UnauthorizedError } from '#utils/error.js'

/**
 * @template T
 * @template P
 * @typedef {T extends import('fastify').FastifyInstance<infer S, infer M, infer R, infer L, infer D> ? import('fastify').FastifyInstance<S, M, R, L, P> : never} Replace
 * */

/** @type {Replace<ReturnType<Fastify>, import('@fastify/type-provider-typebox').TypeBoxTypeProvider>} */
const fastify = Fastify({
  ajv: {
    customOptions: {
      coerceTypes: 'array'
    },
  },
})

export default fastify

/**
 * @param {{
 *  app: typeof fastify
 *  folder: string
 *  prefix?: string
 *  defaultSecurities: {[k: string]: Function}
 *  defaultRespones?: any
 *  openapi: import('@fastify/swagger').FastifyDynamicSwaggerOptions['openapi']
 * }} param0
 */
export async function loadApi({ app, folder, prefix, defaultSecurities, defaultRespones, openapi }) {
  await app.register(fastifySwagger, {
    mode: 'dynamic',
    openapi,
    exposeRoute: true
  })

  const schemaSecurity = Object.keys(defaultSecurities).map(k => ({
    [k]: []
  }))

  const apis = []

  await findAllFiles(folder, /^(?:get|post|put|patch|delete)\.js$/, async ({ file, filename, parentPath }) => {
    // resolve path in windows
    file = file.replace(/(\\)/g, '/')
    // remove .js
    const method = filename.substring(0, filename.length - 3)
    let path = parentPath.substring(folder.length + 1).replace(/\[/g, ':').replace(/\]/g, '')

    if (prefix) {
      path = `${prefix}/${path}`
    }

    /** @type {{
     *  opts: import('#t/handler').Handler<{}>;
     *  schemas: import('openapi-types').OpenAPIV3.ComponentsObject['schemas'];
     * }} */
    const { opts, schemas } = await import(file);
    if (!opts) return

    if (schemas) {
      for (const name in schemas) {
        app.addSchema({
          ...schemas[name],
          $id: name,
        })
      }
    }

    if (opts.schema.consumes?.includes('multipart/form-data')) {
      let preValidation
      if (Array.isArray(opts.preValidation)) {
        preValidation = opts.preValidation
      } else if (opts.preValidation) {
        preValidation = [opts.preValidation]
        opts.preValidation = preValidation
      } else {
        preValidation = []
        opts.preValidation = preValidation
      }

      preValidation.unshift(handleMultiPart)
    }

    if (defaultRespones) {
      if (opts.schema.response) {
        opts.schema.response = {
          ...defaultRespones,
          ...opts.schema.response
        }
      } else {
        opts.schema.response = defaultRespones
      }
    }

    if (opts.schema.security !== null) {
      if (!opts.schema.security) {
        opts.schema.security = schemaSecurity
      }

      let preHandler
      if (Array.isArray(opts.preHandler)) {
        preHandler = opts.preHandler
      } else if (opts.preHandler) {
        preHandler = [opts.preHandler]
        opts.preHandler = preHandler
      } else {
        preHandler = []
        opts.preHandler = preHandler
      }

      preHandler.unshift(req => authMid(req, defaultSecurities))
    }

    const { handler } = opts
    opts.handler = async function() {
      let transaction, data

      if (opts.withTransaction) {
        transaction = await sequelize.transaction()

        try {
          const [req] = arguments
          req.transaction = transaction

          data = await handler.apply(this, arguments)

          await transaction.commit()
        } catch (error) {
          await transaction.rollback()

          throw error
        }
      } else {
        data = await handler.apply(this, arguments)
      }

      return {
        success: true,
        data,
      }
    }

    apis.push({ method, path, opts })
  })

  for (let index = 0; index < apis.length; index++) {
    const { method, path, opts } = apis[index];

    app[method](path, opts)
  }
}

async function handleMultiPart(req) {
  if (!req.isMultipart()) return

  req.fileFields = req.body
  req.body = {}

  for (const key in req.fileFields) {
    const part = req.fileFields[key];

    if (!part.mimetype) {
      req.body[part.fieldname] = part.value
    } else {
      req.body[part.fieldname] = part.filename
    }
  }
}

async function authMid(req, defaultSecurities) {
  if (!req.context?.schema?.security) return

  const { security } = req.context.schema

  let authenticated = false
  for (let index = 0; index < security.length; index++) {
    const element = security[index];
    const authName = Object.keys(element)[0]

    const authHandler = defaultSecurities[authName]

    if (!authHandler) throw new Error(`Not support authentication name: ${authName}`)

    authenticated = await authHandler(req)

    if (authenticated) break
  }

  if (!authenticated) {
    throw new UnauthorizedError('Missing authentication info')
  }
}
