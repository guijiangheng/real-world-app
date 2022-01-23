import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
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
import { CreateUserDto, UpdateUserRequest } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserAuthResponse, UserResponse } from './dtos/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Put('/user')
  @Serialize(UserResponse)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 201, type: UserResponse, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserRequest) {
    return {
      user: await this.userService.update(user.id, body),
    };
  }
}
