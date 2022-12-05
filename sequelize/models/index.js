import Sequelize from 'sequelize';
import { sequelize } from '#connector/db.js'
import models from '#models'

export default {
  sequelize,
  Sequelize,
  ...models,
}