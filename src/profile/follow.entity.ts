import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  followerId: string;

  @Column()
  @Index()
  followingId: string;
}
