import path from 'path';
import { rm } from 'fs/promises';
import { Type } from '@sinclair/typebox';
import { v4 as uuid } from 'uuid';
import { moveFile, isImageFile } from '#utils/files.js';
import { ValidationError } from '#utils/error.js';
import { makeResRef } from '#lib/json-schema.js';
import { params } from './delete.js'
import { checkMemberGroup } from './member/helper.js';
import { GroupChat } from '#models';
import { mediaPath } from '#sv/env.js';
import { eventType } from '#connector/ws.js';
import { queueJob, jobName } from '#connector/queue-job.js';

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  params,
  body: Type.Partial(Type.Object({
    name: Type.String(),
    avatar: Type.String({ format: 'binary' }),
  })),
  response: {
    200: makeResRef('groupchat_only'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    consumes: ['multipart/form-data', 'application/json'],
  },
  async handler(req, _) {
    await checkMemberGroup(req)

    const group = await GroupChat.findByPk(req.params.id)

    let group_avatar = group.getDataValue('group_avatar')
    if (req.fileFields.avatar) {
      const ext = path.extname(req.fileFields.avatar.originalname)
      if (!isImageFile(ext)) throw new ValidationError('Wrong image type')

      if (group_avatar) {
        try {
          await rm(mediaPath + group_avatar)
        } catch (error) {
          console.log(error);
        }
      }

      group_avatar = `/group/${group.id}/${uuid()}${ext}`
      await moveFile(req.fileFields.avatar.path, mediaPath + group_avatar)

      await queueJob.add(jobName.handleFile, { file: mediaPath + group_avatar, ext })
    }

    const newData = { group_avatar }
    if (req.body.name)
      newData.name = req.body.name

    await group.update(newData)

    const data = group.toJSON()

    await queueJob.add(jobName.chatNotifications, {
      eventType: eventType.UpdatedGroup,
      groupId: group.id,
      actorId: req.userId,
      data,
    })

    return data
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
