import { Injectable } from '@nestjs/common';

import { UserEntity } from '~modules/user/user.entity';
import * as jwt from 'jsonwebtoken';
import { AuthConfig } from '~data-api/auth/auth.config';

@Injectable()
export class CreateAccessTokenUseCase {
  constructor(private authConfig: AuthConfig) {}

  execute(user: UserEntity): string {
    const payload = {
      id: user.id,
    };

    return jwt.sign(payload, this.authConfig.jwtTokenSecret, {
      expiresIn: '1 day',
    });
  }
}
