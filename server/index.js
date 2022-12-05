import { readdirSync } from 'fs';
import fastifyStatic from "@fastify/static";
import commonMid from './middlewares/common.js';
import { socketManager } from '#connector/ws.js';
import { serverPort, mediaPath } from "./env.js";
import { backgroundJobs } from '#connector/queue-job.js';
import { sequelize } from '#connector/db.js';
import { redisClient } from '#connector/redis.js';
import fastify, { loadApi } from "#lib/fastify.js";
// import { BullMonitorFastify } from '@bull-monitor/fastify';
import { securityHandler } from './middlewares/auth.js';
import { openApiDocs } from './openapi.js';

main()

async function main() {
  // setup common middlewares
  await commonMid(fastify)

  // const monitor = new BullMonitorFastify({
  //   queues: backgroundJobs,
  //   baseUrl: '/job-monitor',
  //   metrics: {
  //     // collect metrics every X
  //     // where X is any value supported by https://github.com/kibertoad/toad-scheduler
  //     collectInterval: { seconds: 5 },
  //     maxMetrics: 360,
  //   },
  // });
  // await monitor.init({
  //   app: fastify
  // });
  // await fastify.register(monitor.plugin);

  await fastify.register(fastifyStatic, {
    root: mediaPath,
    prefix: '/media/',
  })

  await loadApi({
    app: fastify,
    folder: 'server/api',
    prefix: '/api',
    openapi: openApiDocs,
    defaultSecurities: {
      jwt: securityHandler
    },
    defaultRespones: {
      401: {
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
    },
  })

  for (const file of readdirSync('./server/boot')) {
    if (file.endsWith('.js')) {
      const func = (await import(`#sv/boot/${file}`)).default
      await func(fastify)
    }
  }

  /** Create socket connection */
  socketManager.init(fastify.server);

  await fastify.listen({ port: serverPort })
}
