import { readFile } from 'fs/promises';

/** @type {import('@fastify/swagger').FastifyDynamicSwaggerOptions['openapi']} */
export const openApiDocs = {
  info: {
    title: 'Chat API',
    description: await readFile('openapi-doc.md', { encoding: 'utf8' }),
    version: '1.0.0'
  },
  servers: [{
    url: 'http://localhost:3000/api'
  }],
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT of app',
      },
    },
  },
}
