import { extname } from 'path';
import { Type } from '@sinclair/typebox';
import { Message, Member, GroupChat } from '#models';
import { ForbiddenError, ValidationError } from '#utils/error.js';
import { eventType } from '#connector/ws.js';
import { mediaPath } from '#sv/env.js';
import { isAllowedFile } from '#utils/files.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';
import { mkdir, writeFile } from 'fs/promises';


const requestSchema = {
  body: Type.Object({
    group_id: Type.Integer(),
    content: Type.Optional(Type.String()),
    attachment: Type.Optional(Type.Array(
      Type.String({ format: 'binary' }),
      { maxItems: 5 }
    )),
  }),
  response: {
    200: makeResRef('message'),
    403: makeRef('error'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Message'],
    consumes: ['multipart/form-data', 'application/json'],
  },
  withTransaction: true,
  async handler(req) {
    const { transaction } = req

    if (req.body.group_id) {
      const count = await Member.count({
        where: {
          group_id: req.body.group_id,
          member_id: req.userId,
        },
      })

      if (count === 0)
        throw new ForbiddenError()
    } else {
      throw new ForbiddenError()
    }

    req.body.sender_id = req.userId

    if (
      (!req.fileFields?.attachment || req.fileFields.attachment.length === 0)
      && !req.body.content
    )
      throw new ValidationError('Need at least field content or attachment')

    const files = []
    if (req.fileFields && req.fileFields.attachment) {
      /** @type {import('@fastify/multipart').MultipartFile[]} */
      let attachment = req.fileFields.attachment

      if (!Array.isArray(attachment)) {
        attachment = [attachment]
      }

      for (const att of attachment) {
        const ext = extname(att.filename)
        if (!isAllowedFile(ext)) throw new ValidationError(`File type not allowed: ${ext}`)

        const newPath = `${mediaPath}/group/${req.body.group_id}/attachment`
        const newName = `${Date.now()}.${att.filename}`

        await mkdir(newPath, { recursive: true, mode: 0o755 })
        await writeFile(`${newPath}/${newName}`, att.file)

        files.push({ newPath, ext })
      }
    }

    const message = await Message.create(req.body, {
      transaction,
      fields: ['content', 'friendship_id', 'sender_id', 'group_id'],
    })

    await GroupChat.update({
      last_message_time: message.timestamp,
    }, {
      transaction,
      where: { id: message.group_id },
      returning: false,
    })

    // Auto update viewed for user
    await Member.update({
      viewed_message_id: message.id,
      viewed_message_time: message.timestamp,
    }, {
      transaction,
      where: {
        group_id: message.group_id,
        member_id: req.userId,
      },
      returning: false,
    })

    const attachments = []
    for (let index = 0; index < files.length; index++) {
      const { newPath, ext } = files[index];

      // post-processing for uploaded file
      await queueJob.add(
        jobName.handleFile,
        { file: `${mediaPath}${newPath}`, ext },
        { delay: 5000, },
      )

      attachments.push(await message.createAttachment({
        group_id: message.group_id,
        url: newPath,
        created: message.timestamp,
        order: index,
      }))
    }

    const data = message.toJSON()
    data.attachments = attachments.map(a => a.toJSON())

    await queueJob.add(jobName.chatNotifications, {
      eventType: eventType.NewMessage,
      groupId: message.group_id,
      actorName: req.tokenInfo.username,
      actorId: req.userId,
      data,
    })

    return data
  }
}
