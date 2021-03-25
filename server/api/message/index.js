const { Router } = require("express");

const { checkAuth } = require("@sv/middlewares/jwt");
const getList = require("./get");
const { errorWrapper } = require("@utils/wrapper");
const sendMessage = require('./send-message')

const router = Router()
module.exports = router

router.get(
  '/',
  checkAuth,
  errorWrapper(getList.handler),
)
router.post(
  '/',
  checkAuth,
  errorWrapper(sendMessage.handler)
)
