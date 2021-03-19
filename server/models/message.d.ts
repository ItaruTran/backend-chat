import * as Sequelize from 'sequelize';

export default class extends Sequelize.Model {
  id: number
  timestamp: Date
  content: string
  attachment_type?: number
  attachment?: string
  sender_id: number
  friendship_id: number
}
