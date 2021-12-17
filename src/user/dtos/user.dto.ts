import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class UserAuthDto extends UserDto {
  @ApiProperty()
  @Expose()
  token: string;
}

export class UserResponse {
  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}

export class UserAuthResponse {
  @Type(() => UserAuthDto)
  @Expose()
  user: UserAuthDto;
}
