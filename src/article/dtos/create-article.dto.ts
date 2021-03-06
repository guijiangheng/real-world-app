import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserDto } from '@/user/dtos/user.dto';

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

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (value || []).map((item) => item.trim()))
  readonly tagList: string[];
}

export class NewArticleRequest {
  @ApiProperty()
  @Type(() => NewArticle)
  @IsObject()
  @ValidateNested()
  readonly article: NewArticle;
}

export class ArticleDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  slug: string;

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
  @Transform(({ obj }) => obj.tags.map((tag) => tag.label))
  tagList: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? false)
  favorited: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.favoriteBy?.length || 0)
  favoritesCount: number;

  @ApiProperty()
  @Type(() => UserDto)
  @Expose()
  author: UserDto;

  @ApiProperty({ type: () => [UserDto] })
  @Type(() => UserDto)
  @Expose()
  favoriteBy: UserDto[];
}

export class SingleArticleResponse {
  @ApiProperty()
  @Type(() => ArticleDto)
  @Expose()
  article: ArticleDto;
}
