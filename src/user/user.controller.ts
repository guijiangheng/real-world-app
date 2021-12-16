import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users/login')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: UserDto, description: 'Login success' })
  @ApiBadRequestResponse({
    description: 'Login failed, email or password not correct',
  })
  signin(@Body() body: CreateUserDto) {
    return this.userService.signin(body.email, body.password);
  }

  @Post('users')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserDto, description: 'Sign up success' })
  @ApiBadRequestResponse({ description: 'Sign up failed' })
  signup(@Body() body: CreateUserDto) {
    return this.userService.signup(body.email, body.password);
  }
}
