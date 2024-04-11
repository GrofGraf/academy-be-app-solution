import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { API_V1_PATH } from '~common/http/http.constant';

import { CreateUserUseCase } from '~modules/user/use-cases/create-user.use-case';
import { LoginBodyDto } from './dto/login.body.dto';
import { CreateAccessTokenUseCase } from '~modules/auth/use-cases/create-access-token.use-case';
import { SignupResDto } from './dto/signup.res.dto';
import { LoginUseCase } from '~modules/auth/use-cases/login.use-case';
import { SignupBodyDto } from './dto/signup.body.dto';
import { P, match } from 'ts-pattern';
import {
  UserNotFoundAuthError,
  WrongPasswordAuthError,
} from '~modules/auth/auth.errors';
import { UserAlreadyRegisteredUserError } from '~modules/user/user.errors';

@ApiTags('auth')
@Controller(`${API_V1_PATH}/auth`)
export class AuthController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private createAccessTokenUseCase: CreateAccessTokenUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  @Post('/signup')
  async signup(@Body() data: SignupBodyDto) {
    const result = await this.createUserUseCase.execute(data);

    return result
      .mapErr((error) => {
        match(error)
          .with(P.instanceOf(UserAlreadyRegisteredUserError), (error) => {
            throw new BadRequestException(error, {
              cause: error,
            });
          })
          .exhaustive();
      })
      .map((user) => {
        const accessToken = this.createAccessTokenUseCase.execute(user);

        return new SignupResDto(accessToken);
      });
  }

  @Post('/login')
  async login(@Body() data: LoginBodyDto) {
    const result = await this.loginUseCase.execute(data);

    return result
      .mapErr((error) => {
        match(error)
          .with(P.instanceOf(WrongPasswordAuthError), (error) => {
            throw new ForbiddenException(error, {
              cause: error,
            });
          })
          .with(P.instanceOf(UserNotFoundAuthError), (error) => {
            throw new NotFoundException(error, {
              cause: error,
            });
          })
          .exhaustive();
      })
      .map((accessToken) => {
        return new SignupResDto(accessToken);
      }).val;
  }
}
