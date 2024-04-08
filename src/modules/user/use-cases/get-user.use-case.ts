import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository, USER_REPOSITORY } from '../user.repository';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async byUsername(username: string) {
    return this.userRepository.getByUsername(username);
  }
}
