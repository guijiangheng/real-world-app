import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
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

  @Post('users')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: UserDto, description: 'Sign up success' })
  @ApiBadRequestResponse({ description: 'Sign up failed' })
  signup(@Body() body: CreateUserDto) {
    return this.userService.signup(body.email, body.password);
  }
}
