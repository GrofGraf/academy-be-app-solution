import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { AuthAsyncCtx } from '../../../modules/auth/auth-async-ctx';

import { HandleJwtTokenUseCase } from '~modules/auth/use-cases/handle-jwt-token.use-case';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);
  constructor(
    private authCtx: AuthAsyncCtx,
    private handleJwtTokenUseCase: HandleJwtTokenUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const decoded = this.handleJwtTokenUseCase
      .verifyToken(req)
      .mapErr((error) => {
        this.logger.error(error);
        throw new UnauthorizedException(error.message, {
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
}
