import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  fullname?: string;
  
  @ApiProperty()
  password: string;
}
