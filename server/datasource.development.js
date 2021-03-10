'use strict';
module.exports = {
  'postgresql': {
    host: process.env.POSTGRES_SERVER,
    port: 5432,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    connector: 'postgresql',
    min: 5,
    max: 100,
    idleTimeoutMillis: 60000,
  },
};
