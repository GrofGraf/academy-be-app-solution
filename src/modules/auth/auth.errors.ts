import { BaseError } from '~common/error/base.error';

export class UserNotFoundAuthError extends BaseError {
  constructor() {
    super({
      code: UserNotFoundAuthError.name,
      message: 'User not found',
    });
  }
}

export class WrongPasswordAuthError extends BaseError {
  constructor() {
    super({
      code: WrongPasswordAuthError.name,
      message: 'Wrong password',
    });
  }
}
