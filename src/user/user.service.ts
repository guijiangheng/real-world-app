import { BadRequestException, Injectable } from '@nestjs/common';
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

    const user = this.userRepo.create({ email, password });

    return await this.userRepo.save(user);
  }
}
