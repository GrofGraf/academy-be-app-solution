import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
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

    if (result.err) {
      throw new BadRequestException(result.val, { cause: result.val });
    }

    const accessToken = this.createAccessTokenUseCase.execute(result.unwrap());

    return new SignupResDto(accessToken);
  }

  @Post('/login')
  async login(@Body() data: LoginBodyDto) {
    const result = await this.loginUseCase.execute(data);

    if (result.err) {
      match(result.val)
        .with(P.instanceOf(UserNotFoundAuthError), () => {
          throw new BadRequestException('User not found', {
            cause: result.val,
          });
        })
        .with(P.instanceOf(WrongPasswordAuthError), () => {
          throw new ForbiddenException('Wrong password', {
            cause: result.val,
          });
        })
        .exhaustive();
    }

    return new SignupResDto(result.unwrap());
  }
}
