import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as R from 'ramda';
import * as slug from 'slug';
import { FindCondition, FindOneOptions, Repository } from 'typeorm';

import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { NewCommentRequest } from './dtos/comment.dto';
import { ArticleDto, NewArticle } from './dtos/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  findOne(id: string, options?: FindOneOptions<Article>): Promise<Article | undefined>;

  findOne(
    conditions: FindCondition<Article>,
    options?: FindOneOptions<Article>,
  ): Promise<Article | undefined>;

  findOne(...args: any): Promise<Article | undefined> {
    return this.articleRepo.findOne(...args);
  }

  findOneOrThrow(id: string, options?: FindOneOptions<Article>): Promise<Article>;

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

  async create(user: User, article: NewArticle): Promise<Article> {
    const allTags = await this.tagRepo.find();
    const tagList = R.difference(
      article.tagList,
      allTags.map((tag) => tag.label),
    ).map((label) => this.tagRepo.create({ label }));

    await this.tagRepo.save(tagList);

    const tagSet = R.indexBy(R.prop('label'), await this.tagRepo.find());

    const newArticle = this.articleRepo.create({
      ...article,
      tags: article.tagList.map((label) => tagSet[label]),
      author: user,
      slug: this.slugify(article.title),
    });

    return this.articleRepo.save(newArticle);
  }

  async favorite(userId: string, slug: string): Promise<ArticleDto> {
    const [article, user] = await Promise.all([
      this.findOneOrThrow({ slug }, { relations: ['author', 'favoriteBy', 'tags'] }),
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
      tagList: article.tags.map((tag) => tag.label),
      favorited: true,
      favoritesCount: article.favoriteBy.length,
    };
  }

  async unFavorite(userId: string, slug: string): Promise<ArticleDto> {
    const [article, user] = await Promise.all([
      this.findOneOrThrow({ slug }, { relations: ['author', 'favoriteBy', 'tags'] }),
      this.userRepo.findOne(userId, { relations: ['favoriteArticles'] }),
    ]);

    if (user.favoriteArticles.some((x) => x.slug === slug)) {
      user.favoriteArticles = user.favoriteArticles.filter((x) => x.id !== article.id);
      article.favoriteBy = article.favoriteBy.filter((x) => x.id !== user.id);
      await this.userRepo.save(user);
      await this.articleRepo.save(article);
    }

    return {
      ...article,
      tagList: article.tags.map((tag) => tag.label),
      favorited: false,
      favoritesCount: article.favoriteBy.length,
    };
  }

  async findComments(slug: string) {
    const article = await this.findOneOrThrow(
      { slug },
      { relations: ['comments', 'comments.author'] },
    );

    return article.comments;
  }

  async delete(user: User, slug: string) {
    const article = await this.findOneOrThrow({ slug }, { relations: ['author'] });

    if (article.author.id !== user.id) {
      throw new UnauthorizedException('no right to delete article');
    }

    return this.articleRepo.softDelete({ slug });
  }

  async addComment(user: User, slug: string, newCommentRequest: NewCommentRequest) {
    const article = await this.findOneOrThrow({ slug }, { relations: ['comments'] });
    const comment = this.commentRepo.create({
      body: newCommentRequest.comment.body,
      article,
      author: user,
    });
    article.comments.push(comment);
    await this.commentRepo.save(comment);
    await this.articleRepo.save(article);

    return comment;
  }

  async deleteComment(user: User, slug: string, id: string) {
    const article = await this.findOneOrThrow({ slug }, { relations: ['author'] });
    const comment = await this.commentRepo.findOne(id, { relations: ['author'] });
    console.log(article, comment);
    if (!comment) {
      throw new NotFoundException('comment not exist');
    }

    if (article.author.id !== user.id || comment.author.id !== user.id) {
      throw new UnauthorizedException('no right to delete comment');
    }

    return this.commentRepo.softDelete(id);
  }

  slugify(title: string): string {
    return slug(title, { lower: true }) + '-' + randomBytes(16).toString('hex');
  }
}
