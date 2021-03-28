const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

module.exports = sequelize.define(
  'member',
  {
    member_id: {
      type: Sequelize.INTEGER,
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
  },
  {
    indexes: [
      {
        fields: ['member_id'],
      },
      {
        fields: ['group_id'],
      },
    ],
    createdAt: 'created',
    updatedAt: 'modified',
  }
);
