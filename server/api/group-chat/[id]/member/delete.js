import { Type } from '@sinclair/typebox';
import { Member } from '#models';
import { NotFoundError, ForbiddenError } from '#utils/error.js';
import { eventType } from '#connector/ws.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { sendNotification, getFilterUUID } from '#connector/onesignal.js';
import { params } from '../delete.js'
import { checkGroupChat } from '../../helper.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';

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
    404: makeRef('error'),
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
    const groupOwner = await checkGroupChat(req, { throwErr: false })

    // allow only owner delete other member and this user leave chat
    if (
      (!groupOwner && req.body.member_id !== req.userId) ||
      (groupOwner && req.body.member_id === req.userId)
    ) {
      throw new ForbiddenError('Not have permission to delete member')
    }

    const member = await Member.findOne({
      where: {
        group_id: req.params.id,
        member_id: req.body.member_id,
      }
    })

    if (!member)
      throw new NotFoundError()

    const data = member.toJSON()
    await member.destroy()

    await queueJob.add(jobName.chatNotifications, {
      eventType: eventType.DeleteMember,
      groupId: member.group_id,
      actorId: req.userId,
      data,
    })

    if (req.userId !== member.member_id)
      await sendNotification({
        filters: getFilterUUID([member.member_id]),
        headings: {
          en: groupOwner.name,
          vi: groupOwner.name,
        },
        contents: {
          en: `You have been banned from group chat "${groupOwner.name}"`,
          vi: `Bạn đã bị xóa khỏi nhóm "${groupOwner.name}"`,
        },
      })

    return data
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
