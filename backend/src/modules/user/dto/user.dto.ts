import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AvatarDto } from './avatar.dto';

export class UserDto implements Pick<User, 'email' | 'nickname' | 'firstName' | 'lastName'> {
  @ApiProperty({
    description: 'User email',
    example: 'john124@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'JohnDoe',
  })
  nickname!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'User avatar',
    examples: [
      {
        id: '1',
        path: '/path/to/avatar.png',
      },
      null,
    ],
  })
  avatar!: AvatarDto | null;
}
