import { checkMemberGroup } from '../helper.js';
import { queueJob, jobName } from '#connector/queue-job.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';
import { params } from '../../delete.js'

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  params,
  // body: Type.Object({}),
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

    const now = new Date()
    await member.update({
      view_message_from: now,
      viewed_message_time: now,
    })

    // create job to actually delete old messages
    await queueJob.add(jobName.deleteOldMessage, {
      group_id: member.group_id,
    })

    return member.toJSON()
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
// export const schemas = {
// }
