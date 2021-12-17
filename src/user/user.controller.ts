import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LocalAuthGuard } from '@/auth/local-auth.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('users/login')
  @UseGuards(LocalAuthGuard)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: UserDto, description: 'Ok' })
  @ApiBadRequestResponse({
    description: 'Login failed, email or password not correct',
  })
  signin(@Request() req: any) {
    return req.user;
  }

  @Post('users')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserDto, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Sign up failed' })
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }
}
