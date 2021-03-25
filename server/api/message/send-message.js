const Sequelize = require('sequelize');

const { Message, FriendShip } = require("@models");
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
      throw ForbiddenError()
  } else {
    throw ForbiddenError()
  }

  req.body.sender_id = req.userId

  const message = await Message.create(req.body, {
    fields: ['attachment', 'attachment_type', 'content', 'friendship_id', 'sender_id'],
  })
  const data = message.toJSON()

  if (message.friendship_id) {
    const friendship = await FriendShip.findOne({
      where: { id: message.friendship_id },
    })
    const userId = friendship.user1_id === req.userId ? friendship.user2_id : friendship.user1_id
    socketManager.sendNewMessage(userId, data)
  }

  res.json(data)
}
