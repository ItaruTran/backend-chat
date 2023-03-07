import Redis from 'ioredis';

import prisma from '#connector/prisma.js';
import { sleep } from '#utils/promise-wraper.js';
import { redisSettings } from '#sv/env.js';

async function checkDB() {
  try {
    await prisma.$connect()
    console.log('Connection to database has been established successfully.');

    await prisma.$disconnect()
    return true
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false
  }
}

async function checkRedis() {
  return new Promise((res, _) => {
    const client = new Redis({
      host: redisSettings.host,
      port: redisSettings.port,
    })

    client.on('ready', () => {
      console.log('Connection to redis has been established successfully.');
      client.quit(() => res(true))
    })
    client.on("error", function (error) {
      console.error('Unable to connect to redis', error);
      client.quit()
      res(false)
    });
  })
}

main()
async function main() {
  console.log('Try connect to all services');
  const checker = [
    checkDB, checkRedis,
  ]
  const status = checker.map(() => false)

  for (let index = 1; index < 11; index++) {
    for (let s = 0; s < checker.length; s++) {
      if (!status[s])
        status[s] = await checker[s]()
    }

    if (status.every(sta => sta === true)) {
      console.log('Conection to all services is OK');
      return
    }

    await sleep(3000)
    console.log(`Try times: ${index}`);
  }

  console.log('Conection to services fail');
  process.exit(1)
}
