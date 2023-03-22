import { Type } from '@sinclair/typebox';
import Sequelize from 'sequelize';
import { createJWT } from '#connector/auth.js';
import { User } from '#models';
import { makeRes } from '#lib/json-schema.js';
import { includeUser } from '#sv/env.js';
import createGroup from '#sv/helpers/group-chat/create.js';

const { Op } = Sequelize

const requestSchema = {
  body: Type.Object({
    name: Type.String({ maxLength: 255 }),
  }),
  response: {
    200: makeRes(Type.Object({
      id: Type.String({ format: 'uuid' }),
      name: Type.String(),
      token: Type.String(),
    })),
  },
}

  /** @type {import('#t/handler').Handler<typeof requestSchema>} */
let opts

if (includeUser) {
  opts = {
    schema: {
      ...requestSchema,
      tags: ['Users'],
      security: null,
      // consumes: ['multipart/form-data', 'application/json'],
    },
    withTransaction: true,
    async handler(req) {
      const { name } = req.body

      const [user, created] = await User.findOrCreate({
        where: { name },
        defaults: { name },
      })

      if (created) {
        const users = await User.findAll({
          where: {
            id: { [Op.ne]: user.id }
          },
          limit: 10,
          transaction: req.transaction
        });

        await Promise.all(users.map(u => createGroup(
          user.id,
          {
            name: '',
            friend_id: u.id,
            owner_id: user.id,
          },
          req.transaction
        )))
      }

      return {
        id: user.id,
        name: user.name,
        token: createJWT({
          sub: user.id,
          username: user.name,
        })
      }
    }
  }
}

export { opts }

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
