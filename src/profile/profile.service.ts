import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async follow(followerId: string, username: string): Promise<ProfileDto> {
    const followingUser = await this.userService.findOne({ username });

    if (!followingUser) {
      throw new NotFoundException('following user not found');
    }

    if (followerId === followingUser.id) {
      throw new BadRequestException(
        'follower id and following user id cannot be equal',
      );
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
    const followingUser = await this.userService.findOne({ username });

    if (!followingUser) {
      throw new NotFoundException('following user not found');
    }

    if (followerId === followingUser.id) {
      throw new BadRequestException(
        'follower id and following user id cannot be equal',
      );
    }

    await this.followRepo.delete({ followerId, followingId: followingUser.id });

    return {
      ...followingUser,
      following: false,
    };
  }
}
