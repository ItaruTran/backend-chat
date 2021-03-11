'use strict';

module.exports = async (app) => {
  /** @type {{[k: string]: typeof import('loopback').PersistedModel}} */
  const { Account, FriendList } = app.models;

  const users = [
    'Remy Sharp',
    'Cindy Baker',
    'Alice Rivlin',
  ]

  console.log('Create accounts');
  const accounts = await Promise.all(
    users.map(async (username) => {
      var [instance, _] = await Account.findOrCreate(
        { where: { username } },
        {
          username,
          email: `${username.substr(1, 3)}@test.test`,
          password: '123456',
        }
      );
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
      await FriendList.findOrCreate(
        { where: data },
        data,
      )
    }
  } while (accounts.length > 1);
}
