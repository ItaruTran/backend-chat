import { messagePartition } from '#sv/sql/message.js';
import { redisClient, redisRefix } from '#connector/redis.js';
import prisma from '#connector/prisma.js';

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  if (job.name === 'autoCreatePartition') {
    await prisma.$executeRawUnsafe(messagePartition())

  } else if (job.name === 'updateMessageTime') {
    const keys = await redisClient.keys(redisRefix.latestMessage+'*')
    if (keys.length === 0)
      return 'idle'

    const values = await redisClient.pipeline()
      .mget(keys)
      .del(keys)
      .exec();

    if (values[0][0])
      throw values[0][0]

    const timestamps = values[0][1]

    for (let index = 0; index < keys.length; index++) {
      const groupID = keys[index].replace(redisRefix.latestMessage, '');
      console.log(`Update group ${groupID} ${timestamps[index]}`);

      await prisma.groupChat.update({
        where: {
          id: groupID
        },
        data: {
          last_message_time: timestamps[index],
        }
      })
    }
  } else {
    return 'unknow job'
  }

  return 'ok'
}