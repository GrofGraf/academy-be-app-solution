import { Expose } from 'class-transformer';

export class LoginResDto {
  @Expose()
  accessToken!: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
