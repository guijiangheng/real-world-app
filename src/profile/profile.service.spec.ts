import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { getConnection } from 'typeorm';

import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/user/user.entity';

import { ProfileService } from './profile.service';

const fakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

describe('ProfileService', () => {
  let profileService: ProfileService;
  let authService: AuthService;

  let aUser: User;
  let bUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    authService = module.get<AuthService>(AuthService);

    aUser = await authService.signup(fakeUser());
    bUser = await authService.signup(fakeUser());
  });

  afterEach(() => {
    const conn = getConnection();
    conn.close();
  });

  describe('Follow', () => {
    it('follow non-existent user should throw', async () => {
      try {
        expect.assertions(1);
        await profileService.follow(aUser.id, faker.internet.userName());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('follow success', async () => {
      const { following } = await profileService.follow(
        aUser.id,
        bUser.username,
      );
      expect(following).toBe(true);
    });

    it('duplicate follow request should be ok', async () => {
      await profileService.follow(aUser.id, bUser.username);
      const { following } = await profileService.follow(
        aUser.id,
        bUser.username,
      );
      expect(following).toBe(true);
    });
  });

  describe('UnFollow', () => {
    it('unFollow non-existent user should throw', async () => {
      try {
        expect.assertions(1);
        await profileService.follow(aUser.id, faker.internet.userName());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('unFollow success', async () => {
      const { following } = await profileService.follow(
        aUser.id,
        bUser.username,
      );
      expect(following).toBe(true);
      const unFollowResult = await profileService.unFollow(
        aUser.id,
        bUser.username,
      );
      expect(unFollowResult.following).toBe(false);
    });

    it('unFollow non-followed user should be ok', async () => {
      const { following } = await profileService.unFollow(
        aUser.id,
        bUser.username,
      );
      expect(following).toBe(false);
    });

    it('duplicate unFollow request should be ok', async () => {
      const { following } = await profileService.follow(
        aUser.id,
        bUser.username,
      );
      expect(following).toBe(true);
      await profileService.unFollow(aUser.id, bUser.username);
      const unFollowResult = await profileService.unFollow(
        aUser.id,
        bUser.username,
      );
      expect(unFollowResult.following).toBe(false);
    });
  });
});
