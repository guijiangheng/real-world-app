import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@/user/user.module';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
