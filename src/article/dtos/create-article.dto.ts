import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class NewArticle {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value || '').trim())
  readonly description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value || '').trim())
  readonly body: string;
}

export class CreateArticleDto {
  @ApiProperty()
  @Type(() => NewArticle)
  @IsObject()
  @ValidateNested()
  readonly article: NewArticle;
}

export class AuthorDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  bio: string;

  @ApiProperty()
  @Expose()
  avatar: string;
}

export class ArticleDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

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
  @Type(() => AuthorDto)
  @Expose()
  author: AuthorDto;
}

export class CreateArticleResponse {
  @ApiProperty()
  @Type(() => ArticleDto)
  @Expose()
  article: ArticleDto;
}
