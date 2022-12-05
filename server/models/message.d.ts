import {
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyAddAssociationsMixin,
} from 'sequelize';

import Attachment from './attachment'

interface MessageInput {
  content: string
  sender_id: string
  friendship_id?: number
  group_id?: number
}

interface Message extends MessageInput {
  id: string
  timestamp: Date
}

declare class MessageM extends Model<Message, MessageInput> implements Message {
  id: string
  timestamp: Date
  content: string
  sender_id: string
  friendship_id?: number
  group_id?: number

  public getAttachments: HasManyGetAssociationsMixin<Attachment>;
  public addAttachment: HasManyAddAssociationMixin<Attachment, string>;
  public addAttachments: HasManyAddAssociationsMixin<Attachment, string>
  public hasAttachment: HasManyHasAssociationMixin<Attachment, string>;
  public countAttachments: HasManyCountAssociationsMixin;
  public createAttachment: HasManyCreateAssociationMixin<Attachment>;
}

export = MessageM
