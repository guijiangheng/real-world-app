import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findOne(email: string) {
    return this.userRepo.findOne({ email });
  }

  async create(email: string, password: string) {
    if (await this.findOne(email)) {
      throw new BadRequestException('email already exists');
    }

    const [username] = email.split('@');
    const user = this.userRepo.create({ username, email, password });

    return await this.userRepo.save(user);
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('user not exists');
    }

    return this.userRepo.save(Object.assign(user, attrs));
  }
}
