import * as Sequelize from 'sequelize';

import { sequelize } from "@connector/db";
import { hashPassword } from '@lib/hash';

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
})

function passwordHook(user, options) {
  user.password = hashPassword(user.password)
}
User.beforeCreate(passwordHook)
User.beforeUpdate(passwordHook)

export default User
