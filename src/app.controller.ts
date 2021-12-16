import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Hello world',
    description: 'Hello world API for health check',
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({ description: 'Server works fine' })
  getHello(): string {
    return this.appService.getHello();
  }
}
