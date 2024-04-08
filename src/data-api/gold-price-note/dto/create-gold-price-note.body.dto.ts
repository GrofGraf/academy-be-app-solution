import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGoldPriceNoteBodyDto {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
