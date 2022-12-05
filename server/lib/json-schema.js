import { Type } from "@sinclair/typebox"

/**
 * @param {string} modelName
 * @param {boolean} [isArray]
 * @returns
 */
 export function makeRef(modelName, isArray = false) {
  const schema = {
    $ref: `${modelName}#`
  }

  if (isArray)
    return {
      type: 'array',
      items: schema,
    }
  else
    return schema
}

/**
 * @param {string} modelName
 * @param {boolean} [isArray]
 * @returns
 */
 export function makeResRef(modelName, isArray = false) {
  let schema = {
    $ref: `${modelName}#`
  }

  if (isArray)
    schema = {
      type: 'array',
      items: schema,
    }

  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', default: true, },
      data: schema,
    },
  }
}

/**
 * @template {import("@sinclair/typebox").TSchema} T
 * @param {T} schema
 */
export function makeRes(schema) {
  return Type.Object({
    success: Type.Boolean({ default: true }),
    data: schema,
  })
}
