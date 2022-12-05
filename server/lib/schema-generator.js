import { JsonSchemaManager, OpenApi3Strategy } from '@alt3/sequelize-to-json-schemas'
import { makeRef } from './json-schema.js';

const schemaManager = new JsonSchemaManager();
const strategy = new OpenApi3Strategy()

/**
 * @param {*} model
 * @param {{
 *   title?: string
 *   description?: string,
 *   exclude?: string[],
 *   include?: string[],
 *   associations?: { field: string; ref: string; isArray?: boolean }[]
 * }} [opts]
 * @returns {import('openapi-types').OpenAPIV3.SchemaObject}
 */
export function generateSchema(model, opts = {}) {
  const { associations } = opts
  delete opts.associations

  const schema = schemaManager.generate(model, strategy, { ...opts, associations: false })

  if (Array.isArray(associations) && associations.length > 0) {
    for (let index = 0; index < associations.length; index++) {
      const { field, ref, isArray } = associations[index];

      schema.properties[field] = makeRef(ref, isArray)
    }
  }

  return schema
}
