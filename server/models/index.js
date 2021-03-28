const { includeUser } = require("@sv/env");

exports.FriendShip = require("./friendship");
exports.Message = require("./message");
exports.GroupChat = require('./group-chat')
exports.Member = require('./member')

this.GroupChat.hasMany(
  this.Member,
  { foreignKey: 'group_id' }
)

if (includeUser)
  exports.User = require("./user");
