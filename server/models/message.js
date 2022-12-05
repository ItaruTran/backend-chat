import Sequelize from 'sequelize';
import {sequelize} from '#connector/db.js'

export default sequelize.define(
  'message', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    timestamp: {
      primaryKey: true,
      type: Sequelize.DATE,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
    },
    sender_id: {
      type: Sequelize.UUID,
      allowNull: false,
      // references: {
      //   key: 'id',
      //   model: 'user',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    friendship_id: {
      type: Sequelize.INTEGER,
      // references: {
      //   key: 'id',
      //   model: 'friend_list',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    group_id: {
      type: Sequelize.INTEGER,
    },
  }, {
    tableName: 'message',
    timestamps: false,
  },
);
