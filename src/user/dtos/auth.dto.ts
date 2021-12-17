import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { UserDto } from './user.dto';

export class AuthUserDto extends UserDto {
  @ApiProperty()
  @Expose()
  token: string;
}

export class AuthDto {
  @ApiProperty()
  @Expose()
  @Type(() => AuthUserDto)
  user: AuthUserDto;
}
