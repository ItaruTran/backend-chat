import Message from "./message.js"
import GroupChat from './group-chat.js'
import Member from './member.js'
import Attachment from './attachment.js';
import User from './user.js';

GroupChat.hasMany(
  Member,
  { foreignKey: 'group_id' }
)
GroupChat.hasMany(
  Attachment,
  { foreignKey: 'group_id' }
)

Message.hasMany(
  Attachment,
  { as: 'attachments' }
)

export default {
  Message,
  GroupChat,
  Member,
  Attachment,
  User,
}

export {
  Message,
  GroupChat,
  Member,
  Attachment,
  User,
}
