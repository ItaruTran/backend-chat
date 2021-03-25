const cron = require('node-cron');

const { messagePartition } = require('@sv/sql/message');
const { sequelize } = require('@connector/db')

module.exports = function (server) {
  cron.schedule(`0 17 28 1/1 *`, async () => {
    await sequelize.query(messagePartition())
  })
}
