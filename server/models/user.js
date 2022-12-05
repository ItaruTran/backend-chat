import Sequelize from 'sequelize';
import { sequelize } from '#connector/db.js'

export default sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: 'created',
    updatedAt: 'modified',
  }
);
