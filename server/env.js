import { fileURLToPath } from 'url';

export const stage = process.env.NODE_ENV
export const isProduction = stage === 'production'

export const timeZone = Number(process.env.TIMEZONE || '7');

export const redisSettings = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export const postgresql = {
  host: process.env.POSTGRES_SERVER,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
};

export const onesignal = {
  appId: process.env.ONESIGNAL_APPID,
  apiKey: process.env.ONESIGNAL_APIKEY,
}

export const serverPort = Number(process.env.PORT || "3000")

export const secretKey = process.env.SECRET_KEY
export const adminPassword = process.env.ADMIN_PASSWORD

export const includeUser = process.env.INCLUDE_USER === 'true'

export const allowOrgins = (process.env.ALLOW_ORGINS && process.env.ALLOW_ORGINS.split(',')) || '*'

export const cachePath = process.env.CACHE_PATH || '.cache'
export const mediaPath = fileURLToPath(new URL(process.env.MEDIA_PATH || '../.media', import.meta.url))
export const mediaUrl = process.env.MEDIA_URL

export const appMediaUrl = process.env.APP_MEDIA_URL