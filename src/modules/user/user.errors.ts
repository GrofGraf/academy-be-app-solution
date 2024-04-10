import { BaseError } from '~common/error/base.error';

export class UserAlreadyRegisteredUserError extends BaseError {
  UserAlreadyRegisteredUserError = true;
  code = UserAlreadyRegisteredUserError.name;

  constructor(cause?: Error) {
    super({
      message: 'User already exists',
      cause,
    });
  }
}
