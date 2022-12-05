import Sequelize from "sequelize";
import { Type } from '@sinclair/typebox';
import { GroupChat, Member } from '#models';
import { makeRes } from "#lib/json-schema.js";

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  // params: Type.Object({}),
  // body: Type.Object({}),
  response: {
    200: makeRes(Type.Array(Type.Integer())),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    description: 'Get list id of unread group chat',
    // consumes: ['multipart/form-data', 'application/json'],
  },
  async handler(req, _) {
    const groups = await GroupChat.findAll({
      where: {
        '$members.member_id$': req.userId,
        // exclude chat not have message
        last_message_time: { [Sequelize.Op.not]: null },
        // include unread chat
        [Sequelize.Op.or]: [
          { '$members.viewed_message_time$': null },
          {
            last_message_time: { [Sequelize.Op.gt]: Sequelize.col('members.viewed_message_time') }
          },
        ],
      },
      include: {
        model: Member,
        duplicating: false,
        attributes: [],
      },
      attributes: ['id'],
      raw: true,
    })

    return groups.map(g => g.id)
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
