const { ForbiddenError, ValidationError } = require("@utils/error")

module.exports = Model => {
  async function checkFriendshipId(ctx, id) {
    if (!id)
      return true

    const FriendList = Model.app.models.FriendList
    const userId = ctx.args.options.accessToken.userId
    const count = await FriendList.count({
      id,
      or: [
        { user1_id: userId },
        { user2_id: userId },
      ]
    })

    return count === 0
  }

  Model.beforeRemote('count', async ctx => {
    if (!ctx.args.options.authorizedRoles['admin']) {
      if (!ctx.args.where || await checkFriendshipId(ctx, ctx.args.where.friendship_id))
        throw ForbiddenError()
    }
  })
  Model.beforeRemote('find', async ctx => {
    if (!ctx.args.options.authorizedRoles['admin']) {
      if (
        !ctx.args.filter ||
        !ctx.args.filter.where ||
        await checkFriendshipId(ctx, ctx.args.filter.where.friendship_id)
      )
        throw ForbiddenError()
    }
  })

  Model.beforeRemote('create', async ctx => {
    if (
      !ctx.args.data ||
      await checkFriendshipId(ctx, ctx.args.data.friendship_id)
    )
      throw ValidationError()

    ctx.args.data.sender_id = ctx.args.options.accessToken.userId
  })
}
