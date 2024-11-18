import { ApiProperty } from '@nestjs/swagger';
import { Avatar } from '@prisma/client';

export class AvatarDto implements Pick<Avatar, 'id'> {
  @ApiProperty({
    description: 'Avatar id',
    example: '1',
  })
  id!: string;

  @ApiProperty({
    description: 'Avatar path',
    example: '/path/to/avatar.png',
  })
  path!: string;
}
