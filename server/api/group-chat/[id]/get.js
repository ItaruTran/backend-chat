import { makeResRef } from '#lib/json-schema.js';
import { params } from './delete.js'
import { checkMemberGroup } from './member/helper.js';
import { GroupChat, Member, Message } from '#models';


const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  params,
  // body: Type.Object({}),
  response: {
    200: makeResRef('groupchat_m'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    // consumes: ['multipart/form-data', 'application/json'],
  },
  async handler(req, _) {
    await checkMemberGroup(req)

    const group = await GroupChat.findByPk(
      req.params.id,
      {
        include: {
          model: Member,
          // attributes: [],
          where: {
            member_id: req.userId,
          },
        },
      }
    )

    const json = group.toJSON()

    json.last_message = (await Message.findOne({
      where: { group_id: req.params.id },
      order: [['timestamp', 'DESC']],
    })).toJSON()

    return json
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
