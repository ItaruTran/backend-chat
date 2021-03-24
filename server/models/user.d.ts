import * as Sequelize from 'sequelize';

interface UserInput {
  username: string
  password: string
}

interface User extends UserInput {
  id: number
}

declare class UserM extends Sequelize.Model<User, UserInput> {
  id: number
  username: string
  password: string
}

export = UserM
