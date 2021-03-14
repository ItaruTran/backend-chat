'use strict';

module.exports = {
  timeZone: Number(process.env.TIMEZONE || '7'),
  redisSettings: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  }
}
