const Sequelize = require('sequelize');

const { sequelize } = require("@connector/db");

const { hashPassword } = require('@lib/hash');

const User = sequelize.define(
  'user', {
    id: {
      type: Sequelize.INTEGER,
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
  }, {
    timestamps: false,
  }
)

function passwordHook(user, options) {
  user.password = hashPassword(user.password)
}
User.beforeCreate(passwordHook)
User.beforeUpdate(passwordHook)

module.exports = User
