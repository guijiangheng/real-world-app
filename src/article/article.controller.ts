import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { User } from '@/user/user.entity';

import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  CreateArticleResponse,
} from './dtos/create-article.dto';

@Controller('articles')
@ApiTags('Articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @Serialize(CreateArticleResponse)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an article' })
  @ApiResponse({ status: 201, type: CreateArticleResponse, description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid params' })
  async createArticle(
    @CurrentUser() user: User,
    @Body() dto: CreateArticleDto,
  ) {
    return {
      article: await this.articleService.create(user, dto.article),
    };
  }
}
