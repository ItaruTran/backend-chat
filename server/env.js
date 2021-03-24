'use strict';

exports.timeZone = Number(process.env.TIMEZONE || '7');

exports.redisSettings = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

exports.postgresql = {
  host: process.env.POSTGRES_SERVER,
  port: 5432,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
};

exports.serverPort = process.env.PORT || "3000"

exports.secretKey = process.env.SECRET_KEY
