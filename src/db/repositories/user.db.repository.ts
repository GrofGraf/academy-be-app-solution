import { Injectable } from '@nestjs/common';
import { UserEntity } from '~modules/user/user.entity';
import { IUserRepository } from '~modules/user/user.repository';

import { PrismaService } from '~vendor/prisma/prisma.service';

@Injectable()
export class UserDbRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });

    return user ? UserEntity.toDomain(user) : null;
  }

  async getByUsername(username: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { username },
    });

    return user ? UserEntity.toDomain(user) : null;
  }

  async create(data: UserEntity) {
    const u = await this.prisma.client.user.create({
      data: data._toPersist('create'),
    });

    return UserEntity.toDomain(u);
  }

  async update(data: UserEntity) {
    const u = await this.prisma.client.user.update({
      data: data._toPersist('update'),
      where: { id: data.id },
    });

    return UserEntity.toDomain(u);
  }

  async getAll() {
    const users = await this.prisma.client.user.findMany();

    return users.map((u) => UserEntity.toDomain(u));
  }
}
