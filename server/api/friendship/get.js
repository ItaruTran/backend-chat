const Sequelize = require('sequelize');

const { FriendShip } = require("@models")

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  const friends = await FriendShip.findAll({
    where: Sequelize.or(
      { user1_id: req.userId },
      { user2_id: req.userId },
    ),
  })

  res.json(friends.map(f => f.toJSON()))
}
