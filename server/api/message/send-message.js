module.exports = Model => {
  Model.afterRemote('create', async (ctx, ins) => {
    const FriendList = Model.app.models.FriendList
    const sockerManager = Model.app.sockerManager

    const friendship = await FriendList.findById(ins.friendship_id)
    const userId = friendship.user1_id === ctx.req.accessToken.userId ? friendship.user2_id : friendship.user1_id
    sockerManager.sendNewMessage(userId, ins.toJSON())
  })
}
