import * as Sequelize from 'sequelize';

interface FriendListInput {
  user1_id: number
  user2_id: number
}

interface FriendList extends FriendListInput {
  id: number
}

declare class FriendListM extends Sequelize.Model<FriendList, FriendListInput> {
  id: number
  user1_id: number
  user2_id: number
}

export = FriendListM
