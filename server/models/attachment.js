import Sequelize from 'sequelize';
import {sequelize} from '#connector/db.js'
import {mediaUrl} from '#sv/env.js'

export default sequelize.define(
  'attachment', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    messageId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'group_chats',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        const url = this.getDataValue('url');
        return mediaUrl + url;
      },
    },
    created: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    order: {
      type: Sequelize.INTEGER,
    },
  }, {
    indexes: [
      {
        fields: ['messageId'],
      },
      {
        fields: ['group_id', 'created'],
      },
    ],
    timestamps: false,
  },
);