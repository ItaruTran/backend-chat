
import basicAuth from 'express-basic-auth';
import {adminPassword} from '#sv/env.js'

export const basicAuthMid = basicAuth({
  users: { 'chat-admin': adminPassword, },
  challenge: true,
});
