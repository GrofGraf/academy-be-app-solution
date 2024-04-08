import { BaseError } from '~common/error/base.error';

export class UserAlreadyRegisteredUserError extends BaseError {
  constructor(cause?: Error) {
    super({
      code: UserAlreadyRegisteredUserError.name,
      message: 'User already exists',
      cause,
    });
  }
}
