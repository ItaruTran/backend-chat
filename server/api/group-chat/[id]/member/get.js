import { Member } from '#models';
import { params } from '../delete.js'
import { checkMemberGroup } from './helper.js';
import { makeRef, makeResRef } from '#lib/json-schema.js';

const requestSchema = {
  // querystring: Type.Partial(Type.Object({})),
  // headers: Type.Object({}),
  params,
  // body: Type.Object({}),
  response: {
    200: makeResRef('member', true),
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
    await checkMemberGroup(req)

    const members = await Member.findAll({
      where: {
        group_id: req.params.id,
      },
    })

    return members.map((member) => member.toJSON())
  }
}

/** @type {import('openapi-types').OpenAPIV3.ComponentsObject['schemas']} */
export const schemas = {
  error: {
    title: 'Error',
    type: 'object',
    required: ['success', 'type'],
    properties: {
      success: { type: 'boolean', default: false, },
      message: { type: 'string', nullable: true, },
      type: { type: 'string' },
      data: { type: 'object', nullable: true, },
      stack: { type: 'string', nullable: true, },
    },
  },
}
