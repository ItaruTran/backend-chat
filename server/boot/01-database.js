'use strict';

const { sequelize } = require('@connector/db')
const { createMessageTable, messagePartition, settingDB } = require('@sv/sql/message');
const models = require('@models')

// Migrating database

module.exports = async function (app) {
  console.log(`Running in NODE_ENV: ${process.env.NODE_ENV}`);
  await sequelize.query(settingDB)

  /** @type {(keyof models)[]} */
  const names = ['FriendShip', 'User']
  console.log(`Migrating models: ${names.join(', ')}`);

  for (const n of names) {
    await models[n].sync()
  }

  console.log('Migrating table Message');
  await sequelize.query(createMessageTable)
  await sequelize.query(messagePartition(false))
  await sequelize.query(messagePartition())
};
