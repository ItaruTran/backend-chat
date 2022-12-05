import { rm } from 'fs/promises';

import Sequelize from 'sequelize';

import { mediaPath } from '#sv/env.js';
import { Attachment, Member, Message } from '#models';

const { Op } = Sequelize

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  const { group_id } = job.data

  // check in this chat have users who don't clear history
  const count = await Member.count({
    where: {
      group_id,
      view_message_from: null,
    },
  })

  if (count > 0)
    return 'No need to delete'

  // get member who call clear history oldest
  const member = await Member.findOne({
    where: {
      group_id,
    },
    order: [['view_message_from', 'ASC']],
  })

  const attachments = await Attachment.findAll({
    where: {
      group_id,
      created: { [Op.lte]: member.view_message_from },
    },
  })

  console.log(`Delete old message: attachment count ${attachments.length}`);

  for (const att of attachments) {
    try {
      await rm(mediaPath + att.getDataValue('url'))
    } catch (error) {
      console.log(error);
    }

    await att.destroy()
  }

  console.log(
    'Delete old message: message count',
    await Message.destroy({
      where: {
        group_id,
        timestamp: { [Op.lte]: member.view_message_from },
      },
    })
  )

  return 'ok'
}