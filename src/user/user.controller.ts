import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users')
  @ApiOperation({ summary: 'Register a new user' })
  signup(@Body() body: CreateUserDto) {
    return this.userService.signup(body.email, body.password);
  }
}
