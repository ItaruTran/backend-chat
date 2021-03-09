'use strict';

module.exports = async (app) => {
  try {
    // Migrating admin account
    console.log('Migrating admin account');
    let { Account, Role, RoleMapping } = app.models;
    /// Admin information
    let admins = [
      {
        "username": 'admin',
        "password": "QWE123456",
        "realm": "admin"
      },
    ]
    // Find admin role
    var role = await Role.findOne({ where: { name: 'admin' } })

    var accounts = await Promise.all(
      admins.map(async (admin) => {
        var [instance, _] = await Account.findOrCreate(
          { where: { username: admin.username } },
          { ...admin, firstTime: false }
        );
        return instance;
      })
    )

    await Promise.all(
      accounts.map(async (account) => {
        var [instance, _] = await RoleMapping.findOrCreate({
          where: {
            principalType: RoleMapping.USER,
            principalId: account.id,
          },
        }, {
          principalType: RoleMapping.USER,
          principalId: account.id,
          roleId: role.id,
        });
        return instance;
      })
    );
    return;
  } catch (e) {
    console.log('error when creating admins accounts');
    return;
  }
};
