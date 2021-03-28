const Sequelize = require('sequelize');

const { Message, FriendShip, Member } = require("@models");
const { ForbiddenError } = require('@utils/error');
const { socketManager } = require('@sv/ws');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  if (req.body.friendship_id) {
    const count = await FriendShip.count({
      where: Sequelize.and(
        { id: req.body.friendship_id, },
        Sequelize.or(
          { user1_id: req.userId },
          { user2_id: req.userId },
        ),
      ),
    })

    if (count === 0)
      throw new ForbiddenError()
  } else if (req.body.group_id) {
    const count = await Member.count({
      where: {
        group_id: req.body.group_id,
        member_id: req.userId,
      },
    })

    if (count === 0)
      throw new ForbiddenError()
  } else {
    throw new ForbiddenError()
  }

  req.body.sender_id = req.userId

  const message = await Message.create(req.body, {
    fields: ['attachment', 'attachment_type', 'content', 'friendship_id', 'sender_id', 'group_id'],
  })
  const data = message.toJSON()

  if (message.friendship_id) {
    const friendship = await FriendShip.findOne({
      where: { id: message.friendship_id },
    })
    const userId = friendship.user1_id === req.userId ? friendship.user2_id : friendship.user1_id
    socketManager.sendNewMessage(userId, data)
  } else if (message.group_id) {
    const members = await Member.findAll({
      where: {
        group_id: message.group_id,
      },
    })

    for (const m of members) {
      if (m.member_id === req.userId) continue

      socketManager.sendNewMessage(m.member_id, data)
    }
  }

  res.json(data)
}
