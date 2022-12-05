import { rm } from 'fs/promises';
import { sequelize } from '#connector/db.js';
import { Message, Member, Attachment } from '#models';
import { mediaPath } from '#sv/env.js';
import { deleteFolder } from '#utils/files.js'

/**
 * @param {import('#sv/models/group-chat.js').GroupChatT} groupChat
 */
export async function deleteGroup(groupChat) {
  const group_id = groupChat.id

  const transaction = await sequelize.transaction()
  const opts = {
    where: { group_id },
    transaction,
  }

  try {
    await Attachment.destroy(opts)
    await Message.destroy(opts)
    await Member.destroy(opts)

    const avatar = groupChat.getDataValue('group_avatar')
    if (avatar) {
      try {
        await rm(`${mediaPath}${avatar}`)
      } catch (error) {
        console.log(error);
      }
    }

    await groupChat.destroy({transaction})

    await deleteFolder(`${mediaPath}/group/${group_id}`)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()

    throw err
  }
}