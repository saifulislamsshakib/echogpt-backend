import { IsInt, IsString } from 'class-validator';

export class CreateUsageDto {
  @IsString()
  endpoint: string;

  @IsInt()
  statusCode: number;

  @IsInt()
  responseTime: number;
}
