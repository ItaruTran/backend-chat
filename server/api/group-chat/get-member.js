const Sequelize = require('sequelize');

const { Member } = require("@models");
const { ForbiddenError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  const count = await Member.count({
    where: {
      group_id: req.params.id,
      member_id: req.userId,
    },
  })

  if (count === 0)
    throw new ForbiddenError('Not have permission to get member')

  const members = await Member.findAll({
    where: {
      group_id: req.params.id,
    },
  })

  res.json(members.map(g => g.toJSON()))
}
