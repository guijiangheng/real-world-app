import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { TagResponse } from './dtos/tag.dto';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagController {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  @Get()
  @Serialize(TagResponse)
  @ApiTags('Tags')
  @ApiOperation({ summary: 'Get tags' })
  @ApiOkResponse({ description: 'Ok', type: TagResponse })
  async getTags() {
    return {
      tags: await this.tagRepo.find(),
    };
  }
}
