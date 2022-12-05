import Sequelize from 'sequelize';
import {sequelize} from '#connector/db.js'
import {mediaUrl} from '#sv/env.js'

export default sequelize.define(
  'group_chat',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    owner_id: {
      type: Sequelize.UUID,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    friend_id: {
      type: Sequelize.UUID,
    },
    group_avatar: {
      type: Sequelize.STRING,
      get() {
        const url = this.getDataValue('group_avatar');
        if (url)
          return mediaUrl + url;
        else
          return null
      },
    },
    last_message_time: {
      type: Sequelize.DATE,
    },
  },
  {
    indexes: [
      {
        fields: ['id'],
      },
      {
        fields: ['owner_id'],
      },
    ],
    createdAt: 'created',
    updatedAt: 'modified',
  }
);
