'use strict';

module.exports = async (app) => {
  console.log('Migrating roles');
  const { Role } = app.models;

  const roleNames = ['admin']
  const roles = await Promise.all(
    roleNames.map(role => Role.findOrCreate(
      { where: { name: role } },
      { name: role }
    ))
  )
  for (const role of roles) {
    roleIDs[role[0].name] = role[0].id
  }
}

const roleIDs = {}
module.exports.roleIDs = roleIDs
