import path from 'path';
import Sequelize from 'sequelize';
import { v4 as uuid } from 'uuid';
import { Type } from '@sinclair/typebox';
import { GroupChat, Member } from '#models';
import { ValidationError } from '#utils/error.js';
import { sequelize } from '#connector/db.js';
import { moveFile, isImageFile } from '#utils/files.js';
import { mediaPath } from '#sv/env.js';
import { getFilterUUID, sendNotification } from '#connector/onesignal.js';
import { chuckArray } from '#utils/convert-data.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { generateSchema } from '#lib/schema-generator.js';
import { makeResRef } from '#lib/json-schema.js';
import createGroup from '#sv/helpers/group-chat/create.js';

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  // params: Type.Object({}),
  body: Type.Object({
    name: Type.String(),
    avatar: Type.Optional(Type.String({ format: 'binary' })),
    friend_id: Type.Optional(Type.String({ format: 'uuid' })),
    members: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
  }),
  response: {
    '200': makeResRef('groupchat'),
    '409': makeResRef('groupchat'),
  },
}

/** @type {import('#t/handler').Handler<typeof requestSchema>} */
export const opts = {
  schema: {
    ...requestSchema,
    tags: ['Group chat'],
    consumes: ['multipart/form-data', 'application/json'],
    description: `
- When create chat between 2 users, send request with body
\`\`\`
{
  "name": "user1:<username>:user2:<username>",
  "friend_id": "eb8eb64b-31fd-45e3-8afd-491d2af421f7"
}
\`\`\`

- When create group chat, send request with body
\`\`\`
{
  "name": "new group chat",
  "members": [
    "9c0d9468-a2aa-4bfa-a317-c7ec71a11a6e",
    "07868b0d-a7e8-4e03-b78b-b3ce7b1cbac4"
  ]
}
\`\`\`
`,
  },
  async handler(req, reply) {
    if (req.body.friend_id) {
      if (req.body.friend_id === req.userId)
        throw new ValidationError('Invalid friend_id')

      const group = await GroupChat.findOne({
        where: Sequelize.or(
          { owner_id: req.userId, friend_id: req.body.friend_id },
          { friend_id: req.userId, owner_id: req.body.friend_id },
        ),
      })

      // if chat between 2 users already exists, return it
      if (group) {
        reply.status(409)
        return group.toJSON()
      }
    }

    let group_avatar = null
    if (req.fileFields && req.fileFields.avatar) {
      const ext = path.extname(req.fileFields.avatar.originalname)
      if (!isImageFile(ext)) throw new ValidationError('Wrong image type')

      group_avatar = `/group/${uuid()}${ext}`
      // move file from cache to media
      await moveFile(req.fileFields.avatar.path, mediaPath + group_avatar)

      // post-processing for uploaded image
      await queueJob.add(jobName.handleFile, { file: mediaPath + group_avatar, ext })
    }

    const transaction = await sequelize.transaction()
    let group
    try {
      const data = {
        ...req.body,
        group_avatar,
      }

      await createGroup(req.userId, data, transaction)

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()

      throw err
    }

    let members = []
    const data = group.toJSON()

    if (req.body.members && Array.isArray(req.body.members) && req.body.members.length > 0) {
      const transaction = await sequelize.transaction()

      try {
        for (const mem of req.body.members) {
          members.push((await Member.create({ member_id: mem, group_id: group.id }, { transaction })).toJSON())
        }

        await transaction.commit()
      } catch (error) {
        console.error(error);
        await transaction.rollback()

        members = []
      }

      for (const f of chuckArray(100, req.body.members)) {
        await sendNotification({
          filters: getFilterUUID(f),
          headings: {
            en: 'New group',
          },
          contents: {
            en: group.name,
          },
          data,
        })
      }
    } else if (req.body.friend_id) {
      members.push((await Member.create({ member_id: req.body.friend_id, group_id: group.id })).toJSON())
    }

    data.members = members
    return data
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
export const schemas = {
  groupchat: generateSchema(GroupChat, {
    title: 'GroupChat with members',
    associations: [
      {
        field: 'members',
        ref: 'member',
        isArray: true,
      }
    ]
  }),
}
