import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserAuthResponse, UserResponse } from './dtos/user.dto';

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
  signin(@Request() req: any, @Body() _: CreateUserDto) {
    return {
      user: {
        ...req.user,
        token: this.authService.generateAuthToken(req.user),
      },
    };
  }

  @Post('users')
  @Serialize(UserAuthResponse)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserAuthResponse, description: 'Ok' })
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

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @Serialize(UserResponse)
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the currently logged-in user',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: UserResponse, description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  async whoAmI(@Request() req: any) {
    return {
      user: req.user,
    };
  }
}
