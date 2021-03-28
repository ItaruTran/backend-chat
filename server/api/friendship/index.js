const { Router } = require("express");

const { checkAuth } = require("@sv/middlewares/jwt");
const { errorWrapper } = require("@utils/wrapper");
const getList = require("./get");
const create = require("./create");

const router = Router()
module.exports = router

router.get(
  '/',
  checkAuth,
  errorWrapper(getList.handler),
)
router.post('/', checkAuth, errorWrapper(create.handler))
