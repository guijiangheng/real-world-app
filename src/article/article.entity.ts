import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { User } from '@/user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;
}
