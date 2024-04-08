import { UserEntity } from './user.entity';

export const USER_REPOSITORY = Symbol('UserRepositoryKey');

export interface IUserRepository {
  create(data: UserEntity): Promise<UserEntity>;

  update(data: UserEntity): Promise<UserEntity>;

  getById(id: string): Promise<UserEntity | null>;

  getByUsername(username: string): Promise<UserEntity | null>;

  getAll(): Promise<UserEntity[]>;
}
