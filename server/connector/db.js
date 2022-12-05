import {Sequelize} from 'sequelize';
import {postgresql, stage} from '#sv/env.js'

let logging = console.log
if (stage !== 'production' && stage !== 'staging')
  logging = null

export const sequelize = new Sequelize(
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
    logging
});
