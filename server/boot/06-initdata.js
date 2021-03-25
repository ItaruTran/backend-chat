'use strict';

const { User, FriendShip, } = require('@models')

module.exports = async (app) => {
  const users = [
    'Remy Sharp',
    'Cindy Baker',
    'Alice Rivlin',
  ]

  console.log('Create accounts');
  const accounts = await Promise.all(
    users.map(async (username) => {
      var [instance, _] = await User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password: '123456',
        }
      });
      return instance;
    })
  )

  console.log('Create friendship');
  do {
    const account = accounts.pop()
    for (const acc of accounts) {
      const data = {
        user1_id: account.id,
        user2_id: acc.id,
      }
      await FriendShip.findOrCreate({
        where: data,
        defaults: data,
      })
    }
  } while (accounts.length > 1);
}
