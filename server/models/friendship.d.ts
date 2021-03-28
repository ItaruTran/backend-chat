import * as Sequelize from 'sequelize';

interface FriendShipInput {
  user1_id: number
  user2_id: number
}

interface FriendShip extends FriendShipInput {
  id: number
}

declare class FriendShipM extends Sequelize.Model<FriendShip, FriendShipInput> implements FriendShip {
  id: number
  user1_id: number
  user2_id: number
}

export = FriendShipM
