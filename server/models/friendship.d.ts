import * as Sequelize from 'sequelize';

interface FriendShipInput {
  user1_id: string
  user2_id: string
}

interface FriendShip extends FriendShipInput {
  id: number
}

declare class FriendShipM extends Sequelize.Model<FriendShip, FriendShipInput> implements FriendShip {
  id: number
  user1_id: string
  user2_id: string
}

export = FriendShipM
