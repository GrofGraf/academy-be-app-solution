import { IsString, IsUrl } from 'class-validator';

export class TrackerConfig {
  @IsString()
  apiKey!: string;

  @IsUrl()
  url!: string;
}
