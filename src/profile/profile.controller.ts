import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { User } from '@/user/user.entity';

import { ProfileResponse } from './dtos/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:username/follow')
  @Serialize(ProfileResponse)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiOkResponse({ type: ProfileResponse, description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Following user not found' })
  @ApiBadRequestResponse({
    description: 'Follower id and following user id cannot be equal',
  })
  async follow(@CurrentUser() user: User, @Param('username') username: string) {
    return {
      profile: await this.profileService.follow(user.id, username),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:username/follow')
  @Serialize(ProfileResponse)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'UnFollow a user' })
  @ApiOkResponse({ type: ProfileResponse, description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Following user not found' })
  @ApiBadRequestResponse({
    description: 'Follower id and following user id cannot be equal',
  })
  async unFollow(
    @CurrentUser() user: User,
    @Param('username') username: string,
  ) {
    return {
      profile: await this.profileService.unFollow(user.id, username),
    };
  }
}
