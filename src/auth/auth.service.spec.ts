import { BadRequestException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import * as R from 'ramda';
import { getConnection } from 'typeorm';

import { UserModule } from '@/user/user.module';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        PassportModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET'),
          }),
        }),
        UserModule,
      ],
      providers: [AuthService],
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
