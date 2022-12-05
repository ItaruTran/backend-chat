import Redis from 'ioredis';
import {redisSettings} from '#sv/env.js'

export const redisClient = new Redis({
  host: redisSettings.host,
  port: redisSettings.port,
  retryStrategy(_) {
    // wait for 5s
    return 5000;
  },
});

redisClient.on("error", function(error) {
  console.error(error);
});
redisClient.on('ready', () => {
  console.log('Connect to redis');
})

export const redisRefix = {
  accessToken: 'accessToken/',
  username: 'username/',
  activeUser: 'activeUser/',
  latestMessage: 'latestMessage/',
};
