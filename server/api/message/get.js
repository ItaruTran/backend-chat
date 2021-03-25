const Sequelize = require('sequelize');

const { Message, FriendShip } = require("@models");
const { ForbiddenError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  let filter
  if (req.query.filter)
    filter = JSON.parse(req.query.filter)

  if (!filter || !filter.friendship_id)
    throw ForbiddenError()

  const count = await FriendShip.count({
    where: Sequelize.and(
      { id: filter.friendship_id, },
      Sequelize.or(
        { user1_id: req.userId },
        { user2_id: req.userId },
      ),
    )
  })

  if (count === 0)
    throw ForbiddenError()

  const messages = await Message.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
    where: {
      friendship_id: filter.friendship_id,
    },
  })

  res.json(messages.map(f => f.toJSON()))
}
