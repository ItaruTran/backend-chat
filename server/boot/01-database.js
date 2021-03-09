'use strict';
// Migrating database

const createMainPartition = `
SET enable_partition_pruning = on;
CREATE TABLE IF NOT EXISTS message (
  id  serial not null,
  timestamp  timestamp with time zone not null,
  text  varchar(1000),
  user_id  integer not null,
	conversation_id  integer not null
) PARTITION BY RANGE (timestamp);

CREATE INDEX ON message(id);
CREATE INDEX ON message(user_id);
CREATE INDEX ON message(conversation_id);`;

const createPartition = `
CREATE TABLE IF NOT EXISTS message_2021 PARTITION OF message
    FOR VALUES FROM ('2021-01-01 00:00:00') TO ('2021-12-31 23:59:59');`

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

    let syncStatus = actual ? 'in sync' : 'out of sync';

    console.log('');
    console.log(`Custom models are ${syncStatus}`);
    console.log('');

    if (actual) {
      console.log('Created view successful');
      return cb();
    }

    console.log(`Migrating Custom Models: ${models}`);

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
