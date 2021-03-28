
const { GroupChat, Member } = require("@models");

/**
 * @type {import('@t/request').RequestHandler}
 */
exports.handler = async (req, res, next) => {
  const groups = await GroupChat.findAll({
    where: {
      '$members.member_id$': req.userId,
    },
    include: [{
      model: Member,
      attributes: [],
    }],
  })

  res.json(groups.map(g => g.toJSON()))
}
