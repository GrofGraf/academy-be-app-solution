import { Module } from '@nestjs/common';

import { UserModule } from '~modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthModule } from '~modules/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AuthController],
})
export class AuthDataApiModule {}
