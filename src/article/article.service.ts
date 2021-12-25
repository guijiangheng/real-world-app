import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as slug from 'slug';
import { FindCondition, Repository } from 'typeorm';

import { User } from '@/user/user.entity';

import { Article } from './article.entity';
import { NewArticle } from './dtos/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) { }

  findOne(id: string);

  findOne(conditions: FindCondition<Article>);

  findOne(arg: string | FindCondition<Article>): Promise<Article | undefined> {
    return this.articleRepo.findOne(arg as any);
  }

  create(user: User, article: NewArticle): Promise<Article> {
    const newArticle = this.articleRepo.create({
      ...article,
      author: user,
      slug: this.slugify(article.title),
    });

    return this.articleRepo.save(newArticle);
  }

  slugify(title: string): string {
    return slug(title, { lower: true }) + '-' + randomBytes(16).toString('hex');
  }
}
