import * as Sequelize from 'sequelize';

export default class extends Sequelize.Model {
  id: number
  username: string
  password: string
}
