import { Inject } from '@nestjs/common';
import { InjectableProxy } from 'nestjs-cls';
import { Err, Ok, Result } from 'ts-results';
import { UserEntity } from '~modules/user/user.entity';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '~modules/user/user.repository';
import { NoCurrentUserSetAuthError, NoUserAuthError } from './auth.errors';

@InjectableProxy()
export class AuthAsyncCtx {
  private _currentUser!: UserEntity;

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  get currentUser(): Result<UserEntity, NoCurrentUserSetAuthError> {
    if (!this._currentUser) {
      return Err(new NoCurrentUserSetAuthError());
    }
    return Ok(this._currentUser);
  }

  async initFromJwtToken(
    userId: string,
  ): Promise<Result<UserEntity, NoUserAuthError>> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      return Err(new NoUserAuthError());
    }

    this._currentUser = user;

    return Ok(this._currentUser);
  }
}
