import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@/user/user.service';

import { ProfileDto } from './dtos/profile.dto';
import { Follow } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async getProfile(followerId: string | undefined, username: string): Promise<ProfileDto> {
    const followingUser = await this.userService.findOneOrThrow({ username });

    let following = false;

    if (followerId) {
      const followResult = await this.followRepo.find({
        followerId,
        followingId: followingUser.id,
      });
      following = !!followResult;
    }

    return {
      ...followingUser,
      following,
    };
  }

  async follow(followerId: string, username: string): Promise<ProfileDto> {
    const followingUser = await this.userService.findOneOrThrow({ username });

    if (followerId === followingUser.id) {
      throw new BadRequestException('follower id and following user id cannot be equal');
    }

    const follow = await this.followRepo.findOne({
      followerId,
      followingId: followingUser.id,
    });

    if (!follow) {
      const newFollow = this.followRepo.create({
        followerId,
        followingId: followingUser.id,
      });
      await this.followRepo.save(newFollow);
    }

    return {
      ...followingUser,
      following: true,
    };
  }

  async unFollow(followerId: string, username: string): Promise<ProfileDto> {
    const followingUser = await this.userService.findOneOrThrow({ username });

    if (followerId === followingUser.id) {
      throw new BadRequestException('follower id and following user id cannot be equal');
    }

    await this.followRepo.delete({ followerId, followingId: followingUser.id });

    return {
      ...followingUser,
      following: false,
    };
  }
}
