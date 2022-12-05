import Sequelize from 'sequelize';
import {sequelize} from '#connector/db.js'

export default sequelize.define(
  'member',
  {
    member_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    group_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        key: 'id',
        model: 'group_chats',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    viewed_message_time: {
      type: Sequelize.DATE,
    },
    viewed_message_id: {
      type: Sequelize.UUID,
    },
    view_message_from: {
      type: Sequelize.DATE,
    },
  },
  {
    indexes: [
      {
        fields: ['member_id', 'group_id'],
      },
    ],
    createdAt: 'created',
    updatedAt: 'modified',
  }
);
