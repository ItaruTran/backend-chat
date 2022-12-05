import Sequelize from 'sequelize';
import { sendNotification, getFilterUUID } from '#connector/onesignal.js';
import { deleteGroup } from '#helpers/group-chat/delete.js';
import { GroupChat, Member } from '#models';
import { chuckArray } from '#utils/convert-data.js';
import { checkGroupChat } from '../helper.js';
import { generateSchema } from '#lib/schema-generator.js';
import { makeResRef } from '#lib/json-schema.js';
import { Type } from '@sinclair/typebox';

export const params = Type.Object({
  id: Type.Integer()
})

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.object({}),
  params,
  // body: Type.object({}),
  response: {
    200: makeResRef('groupchat_only'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    // consumes: ['application/json', 'multipart/form-data'],
  },
  async handler(req, _) {
    const group = await checkGroupChat(req)

    const members = await Member.findAll({
      where: {
        group_id: group.id,
        member_id: { [Sequelize.Op.ne]: req.userId },
      },
      attributes: ['member_id'],
      raw: true,
    })

    await deleteGroup(group)

    // send notification when this chat is group chat
    if (group.friend_id === null) {
      try {
        const { username } = req.tokenInfo
        const headings = {
          en: group.name,
          vi: group.name,
        }
        const contents = {
          en: `Group chat "${group.name}" has been deleted by "${username}"`,
          vi: `Nhóm "${group.name}" đã bị "${username}" xóa`,
        }
        for (const ids of chuckArray(100, members.map(m => m.member_id))) {
          await sendNotification({
            filters: getFilterUUID(ids),
            headings,
            contents,
          })
        }
      } catch (error) {
        console.error(error);
      }
    }

    return group.toJSON()
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
export const schemas = {
  groupchat_only: generateSchema(GroupChat, {
    title: 'GroupChat',
    associations: false,
  }),
}
