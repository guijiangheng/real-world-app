import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
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

  @Get('/:slug')
  @Serialize(CreateArticleResponse)
  @ApiOperation({
    summary: 'Get an article',
    description: 'Get an article, auth not required',
  })
  @ApiOkResponse({ type: CreateArticleResponse, description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async getArticle(@Param('slug') slug: string) {
    return {
      article: await this.articleService.findOneOrThrow({ slug }),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:slug')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an article' })
  @ApiOkResponse({ description: 'Delete success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  delete(@Param('slug') slug: string) {
    return this.articleService.delete(slug);
  }
}
