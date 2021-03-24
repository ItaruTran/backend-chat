const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

module.exports = sequelize.define(
  'friend_list', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1_id: {
      type: Sequelize.INTEGER,
      // references: {
      //   key: 'id',
      //   model: 'user',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
    user2_id: {
      type: Sequelize.INTEGER,
      // references: {
      //   key: 'id',
      //   model: 'user',
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      // },
    },
  }, {
    timestamps: false,
  },
)
