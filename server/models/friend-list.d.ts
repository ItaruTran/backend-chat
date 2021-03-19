import * as Sequelize from 'sequelize';

export default class extends Sequelize.Model {
  id: number
  user1_id: number
  user2_id: number
}
