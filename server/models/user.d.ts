import {
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

interface UserInput {
  name: string
}

interface User extends UserInput {
  id: string
}

declare class UserM extends Model<User, UserInput> implements User {
  id: string
  name: string
}

export = UserM
