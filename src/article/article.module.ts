import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Comment, Tag])],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
