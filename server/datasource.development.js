'use strict';
module.exports = {
  'postgresql': {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    user: process.env.RDS_USERNAME,
    connector: 'postgresql',
    min: 5,
    max: 100,
    idleTimeoutMillis: 60000,
  },
};
