import { Expose } from 'class-transformer';

export class SignupResDto {
  @Expose()
  accessToken!: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
