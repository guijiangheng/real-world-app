import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@/auth/local-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserAuthResponse, UserResponse } from './dtos/user.dto';
import { User } from './user.entity';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('users/login')
  @Serialize(UserAuthResponse)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: UserAuthResponse, description: 'Ok' })
  @ApiBadRequestResponse({
    description: 'Login failed, email or password not correct',
  })
  signin(@CurrentUser() user: User, @Body() _: LoginDto) {
    return {
      user: {
        ...user,
        token: this.authService.generateAuthToken(user),
      },
    };
  }

  @Post('users')
  @Serialize(UserAuthResponse)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserAuthResponse, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Sign up failed' })
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.signup(dto);

    return {
      user: {
        ...user,
        token: this.authService.generateAuthToken(user),
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @Serialize(UserResponse)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the currently logged-in user',
  })
  @ApiResponse({ status: 201, type: UserResponse, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  async whoAmI(@CurrentUser() user: User) {
    return {
      user,
    };
  }
}
