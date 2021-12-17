import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  bio: string;

  @ApiProperty()
  @Expose()
  avatar: string;
}

export class UserAuthDto extends UserDto {
  @ApiProperty()
  @Expose()
  token: string;
}

export class UserResponse {
  @ApiProperty()
  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}

export class UserAuthResponse {
  @ApiProperty()
  @Type(() => UserAuthDto)
  @Expose()
  user: UserAuthDto;
}
