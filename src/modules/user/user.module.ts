import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Module({
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class UserModule {}
