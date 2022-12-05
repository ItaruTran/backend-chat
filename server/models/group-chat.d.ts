import {
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

import Member from "./member";

export interface GroupChatInput {
  name: string
  owner_id: string
  friend_id: string
  group_avatar?: string
  last_message_time?: Date
}

interface GroupChat extends GroupChatInput {
  id: number
}

class GroupChatM extends Model<GroupChat, GroupChatInput> implements GroupChat {
  id: number
  name: string
  owner_id: string
  friend_id: string
  group_avatar?: string
  last_message_time?: Date

  public getMembers: HasManyGetAssociationsMixin<Member>;
  public addMember: HasManyAddAssociationMixin<Member, number>;
  public hasMember: HasManyHasAssociationMixin<Member, number>;
  public countMembers: HasManyCountAssociationsMixin;
  public createMember: HasManyCreateAssociationMixin<Member>;
}

export default GroupChatM
