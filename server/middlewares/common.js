import fastifyHelmet from '@fastify/helmet'
import fastifyMultipart from '@fastify/multipart'
import fastifyCors from '@fastify/cors';
import { allowOrgins } from "#sv/env.js";
import fastifyQs from 'fastify-qs'
import { notFoundHandler, errorHandler } from './error-hook.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function (fastify) {
  await fastify.register(fastifyCors, {
    cors: allowOrgins
  })

  await fastify.register(fastifyQs)

  await fastify.register(fastifyHelmet, { global: true })

  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
  });

  fastify.setErrorHandler(errorHandler)
  fastify.setNotFoundHandler(notFoundHandler)
}
