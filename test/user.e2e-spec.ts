import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

import { AppModule } from '../src/app.module';

describe('UserController e2e', () => {
  let app: INestApplication;

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
      .send({ email: '123@123.com', password: '12345' })
      .expect(400);
  });

  it('signup throws if email is not a valid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: '123@123', password: '123456' })
      .expect(400);
  });

  it('signup success not expose password field', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: '123@123.com', password: '123456' })
      .expect(201)
      .expect((response) => {
        expect(response.body.user.email).toBe('123@123.com');
        expect(response.body.user.password).toBeUndefined();
      });
  });
});
