import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TagResponse {
  @ApiProperty()
  @Expose()
  tags: string[];
}
