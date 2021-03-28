const Sequelize = require('sequelize');

const { GroupChat, Member, } = require("@models");
const { ValidationError } = require('@utils/error');

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  if (!req.body.name)
    throw new ValidationError('Missing group name')

  const group = await GroupChat.create({
    name: req.body.name,
    owner_id: req.userId,
  })

  await Member.create({ member_id: req.userId, group_id: group.id })

  res.json(group.toJSON())
}
