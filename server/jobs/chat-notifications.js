import Sequelize from 'sequelize';

import { GroupChat, Member } from '#models';
import { getFilterUUID, createNotification } from '#connector/onesignal.js';
import { chuckArray } from '#utils/convert-data.js';
import { socketManager } from '#connector/ws.js';
import { redisClient, redisRefix } from '#connector/redis.js';

const { Op } = Sequelize

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  const { groupId, eventType, actorId, actorName, data } = job.data

  const members = await Member.findAll({
    where: {
      group_id: groupId,
      member_id: { [Op.ne]: actorId },
    },
    attributes: ['member_id'],
    raw: true,
  })

  if (members.length === 0) return 'ok'

  const deactiveUser = []
  const memberStatus = await redisClient.mget(members.map(m => `${redisRefix.activeUser}${m.member_id}`))

  // check user online or not
  for (let index = 0; index < members.length; index++) {
    const m = members[index];
    if (memberStatus[index] !== null)
      socketManager.sendUserEvent(m.member_id, eventType, data)
    else
      deactiveUser.push(m.member_id)
  }

  if (deactiveUser.length === 0)
    return 'ok'

  let headings, contents, notifData
  if (eventType === 'NewMessage') {
    const group = await GroupChat.findByPk(groupId)

    if (group.friend_id) {
      headings = {
        en: actorName,
        vi: actorName,
      }
    } else {
      headings = {
        en: group.name,
        vi: group.name,
      }
    }

    contents = {
      en: data.content || 'Got a new message',
      vi: data.content || 'Có tin nhắn mới',
    }
    notifData = {
      type: 'new-message',
      data: data,
    }
  } else
    return 'ok'

  for (const f of chuckArray(100, deactiveUser)) {
    console.log(
      'onesignal',
      await createNotification({
        filters: getFilterUUID(f),
        headings,
        contents,
        data: notifData,
      })
    )
  }

  return 'ok'
}