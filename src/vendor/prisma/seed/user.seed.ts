import { UserEntity } from '~modules/user/user.entity';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '~modules/user/user.repository';

export const usersSeed = [
  {
    id: '4c8388cc-e9b9-420d-ae27-a46be06d426b',
    firstName: faker.person.firstName(),
    lastName: faker.person.firstName(),
    username: 'admin',
    password: 'pass',
  },
];

export const userSeed = async (app: INestApplication) => {
  const userRepository = app.get<IUserRepository>(USER_REPOSITORY);
  for (const user of usersSeed) {
    await userRepository.create(await UserEntity.new(user));
  }
};
