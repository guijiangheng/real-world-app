import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

import { UserModule } from '@/user/user.module';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), UserModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
