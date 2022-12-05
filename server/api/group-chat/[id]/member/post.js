import { Type } from '@sinclair/typebox';
import { makeRef, makeResRef } from '#lib/json-schema.js';
import { params } from '../delete.js'
import { Member } from '#models';
import { ValidationError } from '#utils/error.js';
import { eventType } from '#connector/ws.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { sendNotification, getFilterUUID } from '#connector/onesignal.js';
import { checkGroupChat } from '../../helper.js';

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  params,
  body: Type.Object({
    member_id: Type.String({ format: 'uuid' })
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
    const group = await checkGroupChat(req)

    if (!req.body.member_id || req.body.member_id === req.userId)
      throw new ValidationError('Invalid member id')

    const member = await Member.create({
      member_id: req.body.member_id,
      group_id: req.params.id,
    })

    const data = member.toJSON()

    await queueJob.add(jobName.chatNotifications, {
      eventType: eventType.NewMember,
      groupId: member.group_id,
      actorId: req.userId,
      data,
    })

    await sendNotification({
      filters: getFilterUUID([member.member_id]),
      headings: {
        en: 'New group chat',
        vi: `Nhóm chat mới`,
      },
      contents: {
        en: `You have been added to group "${group.name}"`,
        vi: `Bạn đã được thêm vào nhóm "${group.name}"`,
      },
    })

    return data
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
