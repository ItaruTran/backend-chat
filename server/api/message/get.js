const Sequelize = require('sequelize');

const { Message, FriendShip, Member } = require("@models");
const { ForbiddenError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  let filter
  if (req.query.filter)
    filter = JSON.parse(req.query.filter)

  if (!filter || (!filter.friendship_id && !filter.group_id))
    throw new ForbiddenError()

  let where, count = 0

  if (filter.friendship_id) {
    count = await FriendShip.count({
      where: Sequelize.and(
        { id: filter.friendship_id, },
        Sequelize.or(
          { user1_id: req.userId },
          { user2_id: req.userId },
        ),
      )
    })
    where = {
      friendship_id: filter.friendship_id,
    }
  } else if (filter.group_id) {
    count = await Member.count({
      where: {
        group_id: filter.group_id,
        member_id: req.userId,
      },
    })
    where = { group_id: filter.group_id }
  }

  if (count === 0)
    throw new ForbiddenError()

  const messages = await Message.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
    order: [req.query.order.split(' ')],
    where,
  })

  res.json(messages.map(f => f.toJSON()))
}
