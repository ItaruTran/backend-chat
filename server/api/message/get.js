import Sequelize from 'sequelize';
import { Type } from '@sinclair/typebox';
import { Message, Member, Attachment } from '#models';
import { ForbiddenError } from '#utils/error.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';

const requestSchema = {
  querystring: Type.Object({
    filter: Type.String({ examples: ['{"group_id": 1}'] }),
    after_time: Type.Optional(Type.String({ format: 'date-time' })),
    before_time: Type.Optional(Type.String({ format: 'date-time' })),
    limit: Type.Optional(Type.Integer({ default: 10 })),
    offset: Type.Optional(Type.Integer({ default: 0 })),
    order: Type.Optional(Type.String({
      examples: [
        'timestamp DESC',
        'timestamp ASC',
      ],
    })),
  }),
  response: {
    200: makeResRef('message', true),
    403: makeRef('error')
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Message'],
    // consumes: ['multipart/form-data', 'application/json'],
  },
  async handler(req) {
    let filter
    if (req.query.filter)
      filter = JSON.parse(req.query.filter)

    if (!filter || !filter.group_id)
      throw new ForbiddenError()

    const member = await Member.findOne({
      where: {
        group_id: filter.group_id,
        member_id: req.userId,
      },
    })
    if (!member)
      throw new ForbiddenError()

    const where = { group_id: filter.group_id, }

    const timestamp = []
    // for feature clear history
    if (member.view_message_from !== null)
      timestamp.push({ timestamp: { [Sequelize.Op.gt]: member.view_message_from }, })

    // get old messages
    if (req.query.after_time) {
      timestamp.push({
        timestamp: {
          [Sequelize.Op.gte]: req.query.after_time,
        }
      })
    }
    // get unread messages
    else if (req.query.before_time)
      timestamp.push({
        timestamp: {
          [Sequelize.Op.lt]: req.query.before_time,
        }
      })

    where[Sequelize.Op.and] = timestamp

    const messages = await Message.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      order: req.query.order && [req.query.order.split(' ')],
      where,
      include: [{ model: Attachment, as: 'attachments' }],
    })

    return messages.map(f => f.toJSON())
  }
}
