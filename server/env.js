'use strict';

export const timeZone = Number(process.env.TIMEZONE || '7');

export const redisSettings = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export const postgresql = {
  host: process.env.POSTGRES_SERVER,
  port: 5432,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
};

export const serverPort = process.env.PORT || "3000"

export const secretKey = process.env.SECRET_KEY
