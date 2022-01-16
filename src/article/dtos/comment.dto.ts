import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

import { UserDto } from '@/user/dtos/user.dto';

export class NewComment {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly body: string;
}

export class NewCommentRequest {
  @ApiProperty()
  @Type(() => NewComment)
  @IsObject()
  @ValidateNested()
  readonly comment: NewComment;
}

export class Comment {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Type(() => UserDto)
  @Expose()
  author: UserDto;
}

export class SingleCommentResponse {
  @ApiProperty()
  @Type(() => Comment)
  @Expose()
  comment: Comment;
}

export class MultipleCommentsResponse {
  @ApiProperty()
  @Type(() => Comment)
  @Expose()
  comments: Comment[];
}
