import {redisClient, redisRefix} from '#connector/redis.js'

/**
 * @param {{
 * userId: string
 * connectionId: string
 * redisCli?: import('ioredis').Redis
 * }} param0
 * @returns
 */
export async function setActiveUser({ userId, connectionId, redisCli = null}) {
  if (!redisCli)
    redisCli = redisClient

  let key = `${redisRefix.activeUser}${userId}`

  console.log(`Active user ${userId}`);
  await redisCli.set(key, 'true', 'EX', 5 * 60)

  key += `/${connectionId}`
  return redisCli.set(key, 'true', 'EX', 5 * 60)
}

/**
 * @param {string} userId
 * @param {string} connectionId
 */
export async function setDeacticeUser(userId, connectionId) {
  let key = `${redisRefix.activeUser}${userId}`

  console.log(`Deactive user ${userId} ${connectionId}`);
  await redisClient.del(`${key}/${connectionId}`)

  if ((await getActiveConnection(userId)).length === 0)
    await redisClient.del(key)

  return
}

/**
 * @param {string} userId
 * @returns {Promise<string[]>}
 */
export async function getActiveConnection(userId) {
  const key = `${redisRefix.activeUser}${userId}/*`
  let cursor = '0', items = [], tryTime = 0

  while (items.length === 0) {
    [cursor, items] = await redisClient.scan(0, 'MATCH', key, 'COUNT', 1000)

    if (cursor === '0') break

    tryTime += 1
    if (tryTime > 200) throw new Error(`Can't check active user ${userId}, cursor ${cursor}`)
  }

  return items
}

/**
 * @param {string} userId
 * @returns {Promise<'true'|null>}
 */
export function checActiveUser(userId) {
  const key = `${redisRefix.activeUser}${userId}`
  return redisClient.get(key)
}