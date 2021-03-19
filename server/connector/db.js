import { Sequelize } from 'sequelize';

import { postgresql } from '@sv/env';

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
});
