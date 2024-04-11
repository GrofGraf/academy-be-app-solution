import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { ClientRequest } from '~common/http/interfaces/client-request.interface';
import { AuthConfig } from '~data-api/auth/auth.config';
import { AuthAsyncCtx } from '../auth-async-ctx';
import { Err, Ok, Result } from 'ts-results';
import {
  AuthHeaderBadFormatAuthError,
  AuthHeaderBadSchemeAuthError,
  AuthHeaderNoTokenAuthError,
  VerifyingJwtTokenAuthError,
} from '../auth.errors';

type JwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

@Injectable()
export class HandleJwtTokenUseCase {
  constructor(
    private authCtx: AuthAsyncCtx,
    private authConfig: AuthConfig,
  ) {}

  verifyToken(
    req: ClientRequest,
  ): Result<JwtPayload, VerifyingJwtTokenAuthError> {
    const token = this.parseToken(req);

    if (token.err) {
      return Err(new VerifyingJwtTokenAuthError(token.val));
    }

    try {
      const decoded = jwt.verify(
        token.unwrap(),
        this.authConfig.jwtTokenSecret,
      ) as JwtPayload;

      return Ok(decoded);
    } catch (error) {
      return Err(new VerifyingJwtTokenAuthError(error as Error));
    }
  }

  private parseToken(
    req: ClientRequest,
  ): Result<
    string,
    | AuthHeaderBadFormatAuthError
    | AuthHeaderBadSchemeAuthError
    | AuthHeaderNoTokenAuthError
  > {
    let token!: string;

    const authorizationHeader =
      req.headers && 'Authorization' in req.headers
        ? 'Authorization'
        : 'authorization';

    if (req.headers && req.headers[authorizationHeader]) {
      const parts = (req.headers[authorizationHeader] as string).split(' ');
      if (parts.length == 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return Err(new AuthHeaderBadSchemeAuthError());
        }
      } else {
        return Err(new AuthHeaderBadFormatAuthError());
      }
    }

    if (!token) {
      return Err(new AuthHeaderNoTokenAuthError());
    }

    return Ok(token);
  }
}
