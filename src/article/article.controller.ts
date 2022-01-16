import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
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

import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { User } from '@/user/user.entity';

import { ArticleService } from './article.service';
import {
  MultipleCommentsResponse,
  NewCommentRequest,
  SingleCommentResponse,
} from './dtos/comment.dto';
import { CreateArticleDto, CreateArticleResponse } from './dtos/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // create article
  @UseGuards(JwtAuthGuard)
  @Post()
  @Serialize(CreateArticleResponse)
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({ summary: 'Create an article' })
  @ApiResponse({ status: 201, type: CreateArticleResponse, description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid params' })
  async createArticle(@CurrentUser() user: User, @Body() dto: CreateArticleDto) {
    return {
      article: await this.articleService.create(user, dto.article),
    };
  }

  // get article detail
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:slug')
  @Serialize(CreateArticleResponse)
  @ApiTags('Articles')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get an article',
    description: 'Get an article, auth not required',
  })
  @ApiOkResponse({ type: CreateArticleResponse, description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async getArticle(@CurrentUser() user: User | undefined, @Param('slug') slug: string) {
    const article = await this.articleService.findOneOrThrow(
      { slug },
      { relations: ['author', 'favoriteBy'] },
    );

    return {
      article: {
        ...article,
        favorited: user ? article.favoriteBy.some((x) => x.id === user.id) : false,
        favoritesCount: article.favoriteBy.length,
      },
    };
  }

  // delete article
  @UseGuards(JwtAuthGuard)
  @Delete('/:slug')
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({ summary: 'Delete an article' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  delete(@CurrentUser() user: User, @Param('slug') slug: string) {
    return this.articleService.delete(user, slug);
  }

  // favorite article
  @UseGuards(JwtAuthGuard)
  @Post('/:slug/favorite')
  @Serialize(CreateArticleResponse)
  @ApiTags('Favorites')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Favorite an article' })
  @ApiResponse({ status: 201, description: 'Ok', type: CreateArticleResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async favorite(@CurrentUser() user: User, @Param('slug') slug: string) {
    return {
      article: await this.articleService.favorite(user.id, slug),
    };
  }

  // unfavorite article
  @UseGuards(JwtAuthGuard)
  @Delete('/:slug/favorite')
  @Serialize(CreateArticleResponse)
  @ApiTags('Favorites')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiOkResponse({ description: 'Ok', type: CreateArticleResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async unFavorite(@CurrentUser() user: User, @Param('slug') slug: string) {
    return {
      article: await this.articleService.unFavorite(user.id, slug),
    };
  }

  // get comments
  @Get('/:slug/comments')
  @Serialize(MultipleCommentsResponse)
  @ApiTags('Comments')
  @ApiOperation({ summary: 'Get comments, auth is optional' })
  @ApiOkResponse({ description: 'Ok', type: MultipleCommentsResponse })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async getComments(@Param('slug') slug: string) {
    return {
      comments: await this.articleService.findComments(slug),
    };
  }

  // post a comment
  @UseGuards(JwtAuthGuard)
  @Post('/:slug/comments')
  @Serialize(SingleCommentResponse)
  @ApiTags('Comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment' })
  @ApiOkResponse({ description: 'Ok', type: SingleCommentResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async createComment(
    @CurrentUser() user: User,
    @Param('slug') slug: string,
    @Body() body: NewCommentRequest,
  ) {
    return {
      comment: await this.articleService.addComment(user, slug, body),
    };
  }

  // delete a comment
  @UseGuards(JwtAuthGuard)
  @Delete('/:slug/comments/:id')
  @ApiTags('Comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Article or comment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  deleteComment(@CurrentUser() user: User, @Param('slug') slug: string, @Param('id') id: string) {
    return this.articleService.deleteComment(user, slug, id);
  }
}
