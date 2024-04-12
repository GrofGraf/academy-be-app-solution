import { UserEntity } from './user.entity';
import { IUserRepository } from './user.repository';

export class UserRepositoryMock implements IUserRepository {
  async create(data: UserEntity) {
    return data;
  }

  async update(data: UserEntity) {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(id: string) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getByUsername(username: string) {
    return null;
  }

  async getAll() {
    return [];
  }
}
