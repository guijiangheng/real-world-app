import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as R from 'ramda';
import { getConnection } from 'typeorm';

import { AppModule } from '@/app.module';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    const conn = getConnection();
    conn.close();
  });

  it('signup throws when email already exists', async () => {
    const email = faker.internet.email();
    const fakeUsers = R.map(() => ({
      username: faker.internet.userName(),
      email,
      password: faker.internet.password(),
    }))(R.range(0, 2));

    try {
      expect.assertions(1);
      await service.signup(fakeUsers[0]);
      await service.signup(fakeUsers[1]);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('signup throws when username already exists', async () => {
    const username = faker.internet.userName();
    const fakeUsers = R.map(() => ({
      username,
      email: faker.internet.email(),
      password: faker.internet.password(),
    }))(R.range(0, 2));

    try {
      expect.assertions(1);
      await service.signup(fakeUsers[0]);
      await service.signup(fakeUsers[1]);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
