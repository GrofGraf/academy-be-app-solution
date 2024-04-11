import { Global, Module } from '@nestjs/common';
import { CreateAccessTokenUseCase } from './use-cases/create-access-token.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { HandleJwtTokenUseCase } from './use-cases/handle-jwt-token.use-case';

@Global()
@Module({
  providers: [CreateAccessTokenUseCase, LoginUseCase, HandleJwtTokenUseCase],
  exports: [CreateAccessTokenUseCase, LoginUseCase, HandleJwtTokenUseCase],
})
export class AuthModule {}
