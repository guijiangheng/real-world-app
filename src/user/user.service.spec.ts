import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    const conn = getConnection();
    conn.close();
  });

  it('signup throws when email already exists', async () => {
    const fakeUser = {
      email: '123@123.com',
      password: '123456',
    };

    try {
      expect.assertions(1);
      await service.signup(fakeUser.email, fakeUser.password);
      await service.signup(fakeUser.email, fakeUser.password);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
