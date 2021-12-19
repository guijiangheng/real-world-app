import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  generateAuthToken(user: User) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async signin(email: string, password: string) {
    const user = await this.userService.findOne(email);

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

  async signup(dto: CreateUserDto) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await promisify(scrypt)(dto.password, salt, 32)) as Buffer;
    const result = hash.toString('hex') + '.' + salt;

    return await this.userService.create({ ...dto, password: result });
  }
}
