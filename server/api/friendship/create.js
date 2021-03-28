const Sequelize = require('sequelize');

const { FriendShip } = require("@models");
const { ValidationError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  if (!req.body.user_id || req.body.user_id === req.userId)
    throw new ValidationError('Invalid user id')

  const count = await FriendShip.count({
    where: Sequelize.or(
      { user1_id: req.userId, user2_id: req.body.user_id },
      { user2_id: req.userId, user1_id: req.body.user_id },
    ),
  })

  if (count > 0)
    throw new ValidationError('Already exist')

  const friendship = await FriendShip.create({
    user1_id: req.userId,
    user2_id: req.body.user_id
  })

  res.json(friendship.toJSON())
}
