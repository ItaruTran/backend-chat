const Sequelize = require('sequelize');

const { GroupChat, Member, } = require("@models");
const { ValidationError, ForbiddenError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  const count = await GroupChat.count({
    where: {
      owner_id: req.userId,
      id: req.params.id,
    }
  })

  if (count === 0)
    throw new ForbiddenError('Not have permission to add member')

  if (!req.body.member_id || req.body.member_id === req.userId)
    throw new ValidationError('Invalid member id')

  const member = await Member.create({
    member_id: req.body.member_id,
    group_id: req.params.id,
  })

  res.json(member.toJSON())
}
