const { Router } = require("express");

const friendRouter = require("./friend-list");
const userRouter = require('./user')
const messageRouter = require('./message')

const router = Router()
module.exports = router

router.use('/friend-list', friendRouter)
router.use('/users', userRouter)
router.use('/message', messageRouter)
