import * as Sequelize from 'sequelize';

interface MemberInput {
  member_id: string
  group_id: number
  viewed_message_time?: Date
  viewed_message_id?: string
  view_message_from?: Date
}

interface Member extends MemberInput {
  id: number
}

declare class MemberM extends Sequelize.Model<Member, MemberInput> implements Member {
  id: number
  member_id: string
  group_id: number
  viewed_message_time?: Date
  viewed_message_id?: string
  view_message_from?: Date
}

export = MemberM
