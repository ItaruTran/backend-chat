const { Router } = require("express");

const friendRouter = require("./friendship");
const userRouter = require('./user')
const messageRouter = require('./message')

const router = Router()
module.exports = router

router.use('/friendship', friendRouter)
router.use('/users', userRouter)
router.use('/message', messageRouter)
