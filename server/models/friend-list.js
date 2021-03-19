import * as Sequelize from 'sequelize';

import { sequelize } from "@connector/db";

export default sequelize.define(
  'friend_list', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user1_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        key: 'id',
        model: 'user',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    user2_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        key: 'id',
        model: 'user',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  }, {
    timestamps: false,
  },
)
