import { Router } from "express";
import jwt from 'jsonwebtoken';

import { User } from "@models";
import { hashPassword } from "@lib/hash";
import { secretKey } from "@sv/env";

const router = Router()

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  })

  if (!user) {
    res.status(401).send('Unauthorization')
    return next()
  }

  if (user.password !== hashPassword(password)) {
    res.status(401).send('Unauthorization')
    return next()
  }

  res.json({
    id: `Bearer ${jwt.sign({ userId: user.id }, secretKey)}`,
    userId: user.id,
  })
  return next()
})

export default router
