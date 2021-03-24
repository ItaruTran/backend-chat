const Sequelize = require('sequelize');

const { FriendList } = require("@models")

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  const friends = await FriendList.findAll({
    where: Sequelize.or(
      { user1_id: req.userId },
      { user2_id: req.userId },
    ),
  })

  res.json(friends.map(f => f.toJSON()))
}
