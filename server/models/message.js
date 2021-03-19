import * as Sequelize from 'sequelize';

import { sequelize } from '@connector/db';

export default sequelize.define(
  'message', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
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
      type: Sequelize.INTEGER.UNSIGNED,
    },
    attachment: {
      type: Sequelize.STRING,
    },
    sender_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        key: 'id',
        model: 'user',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    friendship_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        key: 'id',
        model: 'friend_list',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    }
  }, {
    timestamps: false,
  },
)
