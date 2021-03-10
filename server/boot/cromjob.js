const cron = require('node-cron');

const { messagePartition } = require('@sv/sql/message');
const { promiseWrapper } = require('@utils/promise-wraper');

module.exports = function (server) {
  cron.schedule(`0 17 28 1/1 *`, async () => {
    const db = server.dataSources.postgresql

    await promiseWrapper(db.connector.execute, messagePartition())
  })
}
