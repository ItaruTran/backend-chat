import { Type } from '@sinclair/typebox';
import sequelize from 'sequelize';
import { User } from '#models';
import { makeRes } from '#lib/json-schema.js';
import { includeUser } from '#sv/env.js';

const requestSchema = {
  querystring: Type.Object({
    ids: Type.Array(
      Type.String({ format: 'uuid' }),
      { minItems: 1 }
    ),
  }),
  response: {
    200: makeRes(
      Type.Array(Type.Object({
        id: Type.String({ format: 'uuid' }),
        name: Type.String(),
      }))
    ),
  },
}

  /** @type {import('#t/handler').Handler<typeof requestSchema>} */
let opts

if (includeUser) {
  opts = {
    schema: {
      ...requestSchema,
      tags: ['Users'],
      // consumes: ['multipart/form-data', 'application/json'],
    },
    async handler(req) {
      const { query } = req
      const users = await User.findAll({
        where: {
          id: { [sequelize.Op.in]: query.ids }
        },
        attributes: ['id', 'name'],
        order: [['id', 'ASC']],
      })

      return users.map((user) => user.toJSON())
    }
  }
}

export { opts }

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
