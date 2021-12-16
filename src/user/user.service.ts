import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt } from 'crypto';
import { Repository } from 'typeorm';
import { promisify } from 'util';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async signin(email: string, password: string) {
    const user = await this.userRepo.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('email or password not correct');
    }

    const [storedHash, salt] = user.password.split('.');
    const hash = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('email or password not correct');
    }

    return user;
  }

  async signup(email: string, password: string) {
    if (await this.userRepo.findOne({ email })) {
      throw new BadRequestException('email already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    const result = hash.toString('hex') + '.' + salt;
    const user = this.userRepo.create({ email, password: result });

    return await this.userRepo.save(user);
  }
}
