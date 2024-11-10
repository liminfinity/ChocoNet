import { ApiProperty } from '@nestjs/swagger';
import { PastryMedia } from '@prisma/client';

export class MediaDto implements Pick<PastryMedia, 'id'> {
  @ApiProperty({
    description: 'Media id',
    example: '1',
  })
  id!: string;

  @ApiProperty({
    description: 'Media path',
    example: '/path/to/cake.png',
  })
  path!: string;
}
