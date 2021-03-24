import * as Sequelize from 'sequelize';

interface MessageInput {
  content: string
  attachment_type?: number
  attachment?: string
  sender_id: number
  friendship_id: number
}

interface Message extends MessageInput {
  id: number
  timestamp: Date
}

declare class MessageM extends Sequelize.Model<Message, MessageInput> {
  id: number
  timestamp: Date
  content: string
  attachment_type?: number
  attachment?: string
  sender_id: number
  friendship_id: number
}

export = MessageM
