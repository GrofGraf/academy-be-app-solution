import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { CreateAccessTokenUseCase } from './create-access-token.use-case';
import { Err, Ok, Result } from 'ts-results';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '~modules/user/user.repository';
import { UserNotFoundAuthError, WrongPasswordAuthError } from '../auth.errors';

@Injectable()
export class LoginUseCase {
  constructor(
    private createAccessTokenUseCase: CreateAccessTokenUseCase,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<Result<string, UserNotFoundAuthError | WrongPasswordAuthError>> {
    const user = await this.userRepository.getByUsername(username);

    if (!user) {
      return Err(new UserNotFoundAuthError());
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return Err(new WrongPasswordAuthError());
    }

    return Ok(this.createAccessTokenUseCase.execute(user));
  }
}
