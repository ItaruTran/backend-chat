'use strict';

const { createMessageTable, messagePartition, settingDB } = require('@sv/sql/message');

// Migrating database

module.exports = function (app, cb) {
  console.log(`Running in NODE_ENV: ${process.env.NODE_ENV}`);

  const db_name = 'postgresql'
  const models = [];
  const config = require('../model-config.json')

  for (const key in config) {
    const model = config[key];
    if (model.dataSource === db_name && model.sync !== false) {
      models.push(key)
    }
  }

  const mydb = app.dataSources[db_name];

  mydb.isActual(models, async (err, actual) => {
    if (err) {
      throw err;
    }

    await executeSql(mydb, settingDB)

    let syncStatus = actual ? 'in sync' : 'out of sync';

    console.log('');
    console.log(`Custom models are ${syncStatus}`);
    console.log('');

    if (actual) {
      return cb();
    }

    console.log(`Migrating Custom Models: ${models}`);

    await executeSql(mydb, createMessageTable)
    await executeSql(mydb, messagePartition(false))
    await executeSql(mydb, messagePartition())

    mydb.autoupdate(models, async (err, result) => {
      if (err) throw err;

      console.log('Custom models migration successful!');

      cb();
    });
  });
};

const executeSql = (dbConnector, sql) => new Promise((res, rej) => {
  dbConnector.connector.execute(sql, null, (err, data) => {
    if (err) {
      return rej(err)
    }
    res(data);
  });
})
