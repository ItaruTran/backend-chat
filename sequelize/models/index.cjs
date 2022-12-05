const Sequelize = require('sequelize');

module.exports = async function () {
  const { sequelize } = await import('#connector/db.js')
  const models = await import('#models')

  return {
    sequelize,
    Sequelize,
    ...models,
  }
}
