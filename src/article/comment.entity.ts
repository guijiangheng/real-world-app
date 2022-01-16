import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { User } from '@/user/user.entity';

import { Article } from './article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
