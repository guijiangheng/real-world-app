import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindCondition, Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findOne(id: string);

  findOne(conditions: FindCondition<User>);

  findOne(arg: string | FindCondition<User>): Promise<User | undefined> {
    return this.userRepo.findOne(arg as any);
  }

  findOneOrThrow(id: string);

  findOneOrThrow(conditions: FindCondition<User>);

  async findOneOrThrow(arg: string | FindCondition<User>): Promise<User> {
    const user = await this.userRepo.findOne(arg as any);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const { username, email, password } = dto;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      throw new BadRequestException('username and email must be unique');
    }

    const newUser = this.userRepo.create({ username, email, password });

    return this.userRepo.save(newUser);
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('user not exists');
    }

    return this.userRepo.save(Object.assign(user, attrs));
  }
}
