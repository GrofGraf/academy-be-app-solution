import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
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
export class JwtGuard implements CanActivate {
  constructor(
    private authCtx: AuthAsyncCtx,
    private authConfig: AuthConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = this.parseToken(req)
      .mapErr((error) => {
        throw new UnauthorizedException(error, {
          cause: error,
        });
      })
      .map((token) => token).val;

    const decoded = this.verifyToken(token).mapErr((error) => {
      throw new UnauthorizedException(error, {
        cause: error,
      });
    }).val;

    const currentUser = await this.authCtx.initFromJwtToken(decoded.id);

    if (currentUser.err) {
      currentUser.mapErr((error) => {
        throw new UnauthorizedException(error, {
          cause: error,
        });
      });
    }

    return true;
  }

  private verifyToken(
    token: string,
  ): Result<JwtPayload, VerifyingJwtTokenAuthError> {
    try {
      const decoded = jwt.verify(
        token,
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
