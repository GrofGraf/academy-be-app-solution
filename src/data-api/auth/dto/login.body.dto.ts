import { IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
