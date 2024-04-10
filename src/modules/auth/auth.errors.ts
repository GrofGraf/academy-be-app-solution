import { BaseError } from '~common/error/base.error';

export class UserNotFoundAuthError extends BaseError {
  UserNotFoundAuthError = true;
  code = UserNotFoundAuthError.name;

  constructor() {
    super({
      message: 'User not found',
    });
  }
}
export class WrongPasswordAuthError extends BaseError {
  WrongPasswordAuthError = true;
  code = WrongPasswordAuthError.name;

  constructor() {
    super({
      message: 'Wrong password',
    });
  }
}
export class NoUserAuthError extends BaseError {
  NoUserAuthError = true;
  code = NoUserAuthError.name;

  constructor() {
    super({
      message: 'No User found',
    });
  }
}
export class NoCurrentUserSetAuthError extends BaseError {
  NoCurrentUserSetAuthError = true;
  code = NoCurrentUserSetAuthError.name;

  constructor() {
    super({
      message: 'Current User not set',
    });
  }
}
export class AuthHeaderBadFormatAuthError extends BaseError {
  AuthHeaderBadFormatAuthError = true;
  code = AuthHeaderBadFormatAuthError.name;

  constructor() {
    super({
      message: 'Format is Authorization: Bearer [token]',
    });
  }
}
export class AuthHeaderBadSchemeAuthError extends BaseError {
  AuthHeaderBadSchemeAuthError = true;
  code = AuthHeaderBadSchemeAuthError.name;

  constructor() {
    super({
      message: 'Format is Authorization: Bearer [token]',
    });
  }
}
export class AuthHeaderNoTokenAuthError extends BaseError {
  AuthHeaderNoTokenAuthError = true;
  code = AuthHeaderNoTokenAuthError.name;

  constructor() {
    super({
      message: 'No authorization token was found',
    });
  }
}
export class VerifyingJwtTokenAuthError extends BaseError {
  VerifyingJwtTokenAuthError = true;
  code = VerifyingJwtTokenAuthError.name;

  constructor(cause: Error) {
    super({
      message: 'Error when verifying token',
      cause,
    });
  }
}
