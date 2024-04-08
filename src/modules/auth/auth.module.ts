import { Module } from '@nestjs/common';
import { CreateAccessTokenUseCase } from './use-cases/create-access-token.use-case';
import { LoginUseCase } from './use-cases/login.use-case';

@Module({
  providers: [CreateAccessTokenUseCase, LoginUseCase],
  exports: [CreateAccessTokenUseCase, LoginUseCase],
})
export class AuthModule {}
