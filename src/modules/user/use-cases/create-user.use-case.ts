import { Inject, Injectable } from '@nestjs/common';
import { Err, Ok, Result } from 'ts-results';

import { IUserRepository, USER_REPOSITORY } from '../user.repository';
import { CreateUser, UserEntity } from '../user.entity';
import { UserAlreadyRegisteredUserError } from '../user.errors';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(
    data: CreateUser,
  ): Promise<Result<UserEntity, UserAlreadyRegisteredUserError>> {
    const existingUser = await this.userRepository.getByUsername(data.username);

    if (existingUser) {
      return Err(new UserAlreadyRegisteredUserError());
    }

    const newUser = await this.userRepository.create(
      await UserEntity.new(data),
    );

    return Ok(newUser);
  }
}
