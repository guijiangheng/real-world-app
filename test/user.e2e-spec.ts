import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as R from 'ramda';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

import { AppModule } from '../src/app.module';

describe('UserController e2e', () => {
  let app: INestApplication;

  const fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    const conn = getConnection();
    conn.close();
  });

  it('signup throws if password is less than 6', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        ...fakeUser,
        password: R.take(5, fakeUser.password),
      })
      .expect(400);
  });

  it('signup throws if email is not a valid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ ...fakeUser, email: faker.lorem.word() })
      .expect(400);
  });

  it('signup success not expose password field', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(fakeUser)
      .expect(201)
      .expect((response) => {
        expect(response.body.user.email).toBe(fakeUser.email);
        expect(response.body.user.password).toBeUndefined();
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const { body } = await request(app.getHttpServer()).post('/users').send(fakeUser).expect(201);

    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${body.user.token}`);

    expect(response.body.user.email).toBe(fakeUser.email);
  });
});
