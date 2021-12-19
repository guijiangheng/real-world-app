import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProfileDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  bio: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  following: boolean;
}

export class ProfileResponse {
  @ApiProperty()
  @Expose()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
