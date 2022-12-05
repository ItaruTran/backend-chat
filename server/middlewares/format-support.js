import multer from 'multer';
import express from 'express';
import {cachePath} from '#sv/env.js'

const mul = multer({
  dest: cachePath,
  limits: {
    fileSize: 11e6,
  },
}).any()

export const consumesMiddleware = {
  'multipart/form-data': function (req, res, next) {
    mul(req, res, function (err) {
      if (err) {
        return next(err);
      }
      if (!req.files) return next()
      // Handle both single and multiple files
      const typeDef = req.operationDoc.requestBody.content['multipart/form-data']
      if (!typeDef) return next()

      const properties = typeDef.schema.properties
      req.fileFields = {}

      for (const file of req.files) {
        const schema = properties[file.fieldname]
        if (!schema) continue

        if (schema.type === 'string' && schema.format === 'binary') {
          req.body[file.fieldname] = ''
          req.fileFields[file.fieldname] = file
        } else if (
          schema.type === 'array' &&
          schema.items.type === 'string' && schema.items.format === 'binary'
        ) {
          if (
            !req.body[file.fieldname] ||
            !Array.isArray(req.body[file.fieldname])
          ) {
            req.body[file.fieldname] = []
            req.fileFields[file.fieldname] = []
          }

          req.body[file.fieldname].push('')
          req.fileFields[file.fieldname].push(file)
        }
      }

      return next();
    });
  },
  'application/json': express.json(),
  'application/x-www-form-urlencoded': express.urlencoded({ extended: false }),
}
