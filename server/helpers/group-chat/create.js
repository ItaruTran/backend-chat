import { GroupChat, Member } from "#models"

/**
 *
 * @param {string} userId
 * @param {import('#sv/models/group-chat.js').GroupChatInput} data
 * @param {*} transaction
 * @returns
 */
export default async function createGroup(userId, data, transaction) {
  // set last_message_time to null to exclude chat from get /api/group-chat/
  const last_message_time = data.friend_id ? null : new Date()

  const group = await GroupChat.create({
    name: data.name,
    owner_id: userId,
    group_avatar: data.group_avatar,
    friend_id: data.friend_id,
    last_message_time,
  }, { transaction })

  // always create this for server logic
  await Member.create({ member_id: userId, group_id: group.id }, { transaction })

  if (data.friend_id) {
    await Member.create({ member_id: data.friend_id, group_id: group.id }, { transaction })
  }

  return group
}