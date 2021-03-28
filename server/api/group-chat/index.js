const { Router } = require("express");

const { checkAuth } = require("@sv/middlewares/jwt");
const { errorWrapper } = require("@utils/wrapper");

const getList = require("./get");
const create = require('./create')
const addMember = require('./add-member')
const getMember = require('./get-member')

const router = Router()
module.exports = router

router.post('/', checkAuth, errorWrapper(create.handler))
router.get('/', checkAuth, errorWrapper(getList.handler))
router.post('/:id(\\d+)/member/', checkAuth, errorWrapper(addMember.handler))
router.get('/:id(\\d+)/member/', checkAuth, errorWrapper(getMember.handler))
