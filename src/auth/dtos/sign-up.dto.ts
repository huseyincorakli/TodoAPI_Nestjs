import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  fullname?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
