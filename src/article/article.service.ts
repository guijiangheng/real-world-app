import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as R from 'ramda';
import * as slug from 'slug';
import { FindCondition, FindOneOptions, Repository } from 'typeorm';

import { User } from '@/user/user.entity';

import { Article } from './article.entity';
import { ArticleDto, NewArticle } from './dtos/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findOne(
    id: string,
    options?: FindOneOptions<Article>,
  ): Promise<Article | undefined>;

  findOne(
    conditions: FindCondition<Article>,
    options?: FindOneOptions<Article>,
  ): Promise<Article | undefined>;

  findOne(...args: any): Promise<Article | undefined> {
    return this.articleRepo.findOne(...args);
  }

  findOneOrThrow(
    id: string,
    options?: FindOneOptions<Article>,
  ): Promise<Article>;

  findOneOrThrow(
    conditions: FindCondition<Article>,
    options?: FindOneOptions<Article>,
  ): Promise<Article>;

  async findOneOrThrow(...args: any): Promise<Article> {
    const article = await this.articleRepo.findOne(...args);

    if (!article) {
      throw new NotFoundException('article not found');
    }

    return article;
  }

  create(user: User, article: NewArticle): Promise<Article> {
    const newArticle = this.articleRepo.create({
      ...article,
      author: user,
      slug: this.slugify(article.title),
    });

    return this.articleRepo.save(newArticle);
  }

  async favorite(userId: string, slug: string): Promise<ArticleDto> {
    const [article, user] = await Promise.all([
      this.findOneOrThrow({ slug }, { relations: ['author', 'favoriteBy'] }),
      this.userRepo.findOne(userId, { relations: ['favoriteArticles'] }),
    ]);

    if (!user.favoriteArticles.some((x) => x.slug === slug)) {
      user.favoriteArticles.push(R.omit(['author', 'favoriteBy'], article));
      article.favoriteBy.push(R.omit(['favoriteArticles'], user));
      await this.userRepo.save(user);
      await this.articleRepo.save(article);
    }

    return {
      ...article,
      favorited: true,
      favoritesCount: article.favoriteBy.length,
    };
  }

  async unFavorite(userId: string, slug: string): Promise<ArticleDto> {
    const [article, user] = await Promise.all([
      this.findOneOrThrow({ slug }, { relations: ['author', 'favoriteBy'] }),
      this.userRepo.findOne(userId, { relations: ['favoriteArticles'] }),
    ]);

    if (user.favoriteArticles.some((x) => x.slug === slug)) {
      user.favoriteArticles = user.favoriteArticles.filter(
        (x) => x.id !== article.id,
      );
      article.favoriteBy = article.favoriteBy.filter((x) => x.id !== user.id);
      await this.userRepo.save(user);
      await this.articleRepo.save(article);
    }

    return {
      ...article,
      favorited: false,
      favoritesCount: article.favoriteBy.length,
    };
  }

  delete(slug: string) {
    return this.articleRepo.softDelete({ slug });
  }

  slugify(title: string): string {
    return slug(title, { lower: true }) + '-' + randomBytes(16).toString('hex');
  }
}
