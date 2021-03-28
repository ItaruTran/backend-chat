const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

module.exports = sequelize.define(
  'friendship', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1_id: {
      type: Sequelize.INTEGER,
      // references: {
      //   key: 'id',
      //   model: 'users',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    user2_id: {
      type: Sequelize.INTEGER,
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
)
