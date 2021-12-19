import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { User } from '@/user/user.entity';

import { ProfileResponse } from './dtos/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:username')
  @Serialize(ProfileResponse)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a profile',
    description: 'Get a profile of a user of the system. Auth is optional',
  })
  @ApiOkResponse({ type: ProfileResponse, description: 'Ok' })
  @ApiNotFoundResponse({ description: 'user not found' })
  async getProfile(
    @CurrentUser() user: User | undefined,
    @Param('username') username: string,
  ) {
    return {
      profile: await this.profileService.getProfile(user?.id, username),
    };
  }

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
