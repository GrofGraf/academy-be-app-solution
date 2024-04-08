import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import * as argon2 from 'argon2';

import { BaseEntity, trackChanges } from '~common/entity/base.entity';

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUser = Partial<CreateUser>;

export class UserEntity extends BaseEntity<User> implements User {
  @Expose()
  id!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  username!: string;

  @Expose()
  password!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  private constructor(data: User) {
    super();
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async new(data: CreateUser) {
    return new UserEntity({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      password: await argon2.hash(data.password),
    });
  }

  update(changes: UpdateUser) {
    this._operation = 'update';

    return Object.assign(this, {
      ...changes,
      updatedAt: new Date(),
    });
  }

  static toDomain(data: User) {
    return trackChanges<UserEntity>(new UserEntity(data));
  }
}
