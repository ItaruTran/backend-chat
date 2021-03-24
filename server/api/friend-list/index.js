const { Router } = require("express");

const { checkAuth } = require("@sv/middlewares/jwt");
const getList = require("./get");
const { errorWrapper } = require("@utils/wrapper");

const router = Router()
module.exports = router

router.get(
  '/',
  checkAuth,
  errorWrapper(getList.handler),
)
