const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

module.exports = sequelize.define(
  'group_chat',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    owner_id: {
      type: Sequelize.INTEGER,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
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
