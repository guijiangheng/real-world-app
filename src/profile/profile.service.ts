import { Injectable } from '@nestjs/common';

import { UserService } from '@/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}
}
