import { Entity, model, property } from '@loopback/repository';

@model({ settings: { "strict": false } })

export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  fullName: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  role: string[];

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  userAddress: string;

  @property({
    type: 'string',
  })
  dateOfBirth: string;

  @property({
    type: 'string',
  })
  address: string;

  @property({
    type: 'Object',
  })
  avatar: object;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
