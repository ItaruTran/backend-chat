import Sequelize from "sequelize";
import { Attachment, GroupChat, Member, Message } from '#models';
import { makeResRef } from '#lib/json-schema.js';
import { Type } from "@sinclair/typebox";
import { generateSchema } from '#lib/schema-generator.js';

const requestSchema = {
  querystring: Type.Partial(Type.Object({
    group_name: Type.String({ minLength:  1 }),
    limit: Type.Number({ default: 10 }),
    offset: Type.Number({ default: 0 }),
    order: Type.String({
      examples: [
        'last_message_time DESC',
        'last_message_time ASC',
      ]
    }),
  })),
  // headers: Type.object({}),
  // params: Type.object({}),
  // body: Type.object({}),
  response: {
    200: makeResRef('groupchat_m', true),
  }
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    // consumes: ['application/json', 'multipart/form-data'],
  },
  async handler(req, _) {
    let where = {
      '$members.member_id$': req.userId,
      // exclude chat not have message
      // last_message_time: { [Sequelize.Op.not]: null }
    }

    if (req.query.group_name) {
      where.name = { [Sequelize.Op.iLike]: `%${req.query.group_name}%` }
    } else {
      // include chat not clear history or have new message after clear history
      where[Sequelize.Op.or] = [
        { '$members.view_message_from$': null },
        {
          last_message_time: { [Sequelize.Op.gt]: Sequelize.col('members.view_message_from') }
        },
      ]
    }

    const groups = await GroupChat.findAll({
      where,
      limit: req.query.limit,
      offset: req.query.offset,
      order: req.query.order && [req.query.order.split(' ')],
      include: {
        model: Member,
        duplicating: false,
      },
    })

    const json = []
    let lastMessages = []
    for (const g of groups) {
      const where = {
        group_id: g.id,
      }
      if (g.members[0].view_message_from !== null) {
        where.timestamp = { [Sequelize.Op.gt]: g.members[0].view_message_from }
      }

      lastMessages.push(Message.findOne({
        where,
        order: [['timestamp', 'DESC']],
      }))

      json.push(g.toJSON())
    }

    lastMessages = await Promise.all(lastMessages)

    for (let index = 0; index < lastMessages.length; index++) {
      json[index].last_message = lastMessages[index]?.toJSON();
    }

    return json
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
export const schemas = {
  groupchat_m: generateSchema(GroupChat, {
    title: 'GroupChat with last message',
    associations: [
      {
        field: 'members',
        ref: 'member',
        isArray: true,
      },
      {
        field: 'last_message',
        ref: 'message',
      },
    ],
  }),
  attachment: generateSchema(Attachment),
  message: generateSchema(Message, {
    associations: [
      {
        field: 'attachments',
        ref: 'attachment',
        isArray: true,
      },
    ]
  }),
  member: generateSchema(Member),
}
