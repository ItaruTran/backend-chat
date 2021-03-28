const { Sequelize } = require('sequelize');

const { postgresql, stage } = require('@sv/env');

exports.sequelize = new Sequelize(
  postgresql.database,
  postgresql.user,
  postgresql.password, {
    host: postgresql.host,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: stage !== 'production'
});
