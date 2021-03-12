
module.exports = Model => {
  function strictRequest(where, userId) {
    const and = [
      {
        or: [
          { user1_id: userId },
          { user2_id: userId },
        ]
      },
    ]
    if (where)
      and.push(where)

    return {
      and,
    }
  }

  Model.beforeRemote('count', async ctx => {
    if (!ctx.args.options.authorizedRoles['admin'])
      ctx.args.where = strictRequest(ctx.args.where, ctx.args.options.accessToken.userId)
  })
  Model.beforeRemote('find', async ctx => {
    if (!ctx.args.options.authorizedRoles['admin']) {
      if (!ctx.args.filter)
        ctx.args.filter = { where: strictRequest(undefined, ctx.args.options.accessToken.userId) }
      else
        ctx.args.filter.where = strictRequest(ctx.args.filter.where, ctx.args.options.accessToken.userId)
    }
  })
}
