import { messagePartition } from '#sv/sql/message.js';
import { sequelize } from '#connector/db.js';
import { redisClient, redisRefix } from '#connector/redis.js';
import { GroupChat } from '#models';

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  if (job.name === 'autoCreatePartition') {
    await sequelize.query(messagePartition())

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

      await GroupChat.update({
        last_message_time: timestamps[index],
      }, {
        where: { id: groupID }
      })
    }
  } else {
    return 'unknow job'
  }

  return 'ok'
}