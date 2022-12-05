import Sequelize from 'sequelize';
import {sequelize} from '#connector/db.js'

export default sequelize.define(
  'friendship', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1_id: {
      type: Sequelize.UUID,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    user2_id: {
      type: Sequelize.UUID,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
  }, {
    indexes: [
      {
        fields: ['id']
      },
      {
        fields: ['user1_id']
      },
      {
        fields: ['user2_id']
      },
    ],
    createdAt: 'created',
    updatedAt: 'modified',
  },
);
