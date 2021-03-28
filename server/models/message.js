const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

module.exports = sequelize.define(
  'message', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      primaryKey: true,
      type: Sequelize.DATE,
    },
    content: {
      type: Sequelize.STRING,
    },
    attachment_type: {
      type: Sequelize.INTEGER,
    },
    attachment: {
      type: Sequelize.STRING,
    },
    sender_id: {
      type: Sequelize.INTEGER,
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
)
