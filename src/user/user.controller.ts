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
import { AuthDto } from './dtos/auth.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller()
@ApiTags('User and Authorization')
export class UserController {
  constructor(private authService: AuthService) {}

  @Post('users/login')
  @UseGuards(LocalAuthGuard)
  @Serialize(AuthDto)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthDto, description: 'Ok' })
  @ApiBadRequestResponse({
    description: 'Login failed, email or password not correct',
  })
  signin(@Request() req: any, @Body() _: CreateUserDto) {
    return {
      user: {
        ...req.user,
        token: this.authService.generateAuthToken(req.user),
      },
    };
  }

  @Post('users')
  @Serialize(AuthDto)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthDto, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Sign up failed' })
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);

    return {
      user: {
        ...user,
        token: this.authService.generateAuthToken(user),
      },
    };
  }
}
