import * as Sequelize from 'sequelize';

interface MemberInput {
  member_id: number
  group_id: number
}

interface Member extends MemberInput {
  id: number
}

declare class MemberM extends Sequelize.Model<Member, MemberInput> implements Member {
  id: number
  member_id: number
  group_id: number
}

export = MemberM
