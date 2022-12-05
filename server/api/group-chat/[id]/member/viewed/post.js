import { Type } from '@sinclair/typebox';
import { eventType } from '#connector/ws.js';
import { checkMemberGroup } from '../helper.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  // params: Type.Object({}),
  body: Type.Object({
    viewed_message_id: Type.String({ format: 'uuid' }),
    viewed_message_time: Type.Optional(Type.String({ format: 'date-time' })),
  }),
  response: {
    200: makeResRef('member'),
    403: makeRef('error'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    // consumes: ['multipart/form-data', 'application/json'],
  },
  async handler(req) {
    const member = await checkMemberGroup(req)

    await member.update({
      viewed_message_id: req.body.viewed_message_id,
      viewed_message_time: req.body.viewed_message_time,
    })

    const data = member.toJSON()

    await queueJob.add(jobName.chatNotifications, {
      eventType: eventType.ViewedMessage,
      groupId: member.group_id,
      actorId: req.userId,
      data,
    })

    return data
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
