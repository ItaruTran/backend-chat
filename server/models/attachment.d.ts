import * as Sequelize from 'sequelize';

interface AttachmentInput {
  messageId: string
  group_id: number
  url: string
  created: Date
  order: number
}

interface Attachment extends AttachmentInput {
  id: string
}

declare class AttachmentM extends Sequelize.Model<Attachment, AttachmentInput> implements Attachment {
  id: string
  messageId: string
  group_id: number
  url: string
  created: Date
  order: number
}

export = AttachmentM