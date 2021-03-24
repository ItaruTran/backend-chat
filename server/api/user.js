const { Router } = require("express");
const jwt = require('jsonwebtoken');

const { User } = require("@models");
const { hashPassword } = require("@lib/hash");
const { secretKey } = require("@sv/env");

const router = Router()
module.exports = router

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  })

  if (!user) {
    res.status(401).send('Unauthorization')
    return
  }

  if (user.password !== hashPassword(password)) {
    res.status(401).send('Unauthorization')
    return
  }

  res.json({
    id: `Bearer ${jwt.sign({ userId: user.id }, secretKey)}`,
    userId: user.id,
  })
  return
})
