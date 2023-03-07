import * as fs from 'fs'
import * as path from 'path'
import { generatorHandler } from '@prisma/generator-helper'
import trans from 'prisma-json-schema-generator/dist/generator/transformDMMF.js'
import { parseEnvValue } from '@prisma/internals'

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './json-schema',
      prettyName: 'Prisma JSON Schema Generator',
    }
  },
  async onGenerate(options) {
    const jsonSchema = trans.transformDMMF(options.dmmf, options.generator.config)
    console.log(jsonSchema.properties);

    if (options.generator.output) {
      const outputDir =
        // This ensures previous version of prisma are still supported
        typeof options.generator.output === 'string'
          ? (options.generator.output)
          : parseEnvValue(options.generator.output)
      try {
        await fs.promises.mkdir(outputDir, {
          recursive: true,
        })
        await fs.promises.writeFile(
          path.join(outputDir, 'json-schema.json'),
          JSON.stringify(jsonSchema, null, 2),
        )
      } catch (e) {
        console.error(
          'Error: unable to write files for Prisma Schema Generator',
        )
        throw e
      }
    } else {
      throw new Error(
        'No output was specified for Prisma Schema Generator',
      )
    }
  },
})