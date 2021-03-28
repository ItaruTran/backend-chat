const { Router } = require("express");

const friendRouter = require("./friendship");
const messageRouter = require('./message')
const groupRouter = require('./group-chat');
const { includeUser } = require("@sv/env");

const router = Router()
module.exports = router

router.use('/friendship', friendRouter)
router.use('/message', messageRouter)
router.use('/group-chat', groupRouter)

if (includeUser) {
  const userRouter = require('./user')
  router.use('/users', userRouter)
}
