import {
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

import Member from "./member";

interface GroupChatInput {
  name: string
  owner_id: number
}

interface GroupChat extends GroupChatInput {
  id: number
}

declare class GroupChatM extends Model<GroupChat, GroupChatInput> implements GroupChat {
  id: number
  name: string
  owner_id: number

  public getMembers: HasManyGetAssociationsMixin<Member>;
  public addMember: HasManyAddAssociationMixin<Member, number>;
  public hasMember: HasManyHasAssociationMixin<Member, number>;
  public countMembers: HasManyCountAssociationsMixin;
  public createMember: HasManyCreateAssociationMixin<Member>;
}

export = GroupChatM
