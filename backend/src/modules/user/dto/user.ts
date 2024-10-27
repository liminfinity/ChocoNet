import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GeolocationDto } from './geolocation';
import { AvatarDto } from './avatar';

export class UserDto implements Omit<User, 'password' | 'updatedAt' | 'id'> {
  @ApiProperty({
    description: 'User email',
    example: 'john124@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '123456789',
  })
  phone!: string;

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
    description: 'User about',
    example: 'About John Doe',
  })
  about!: string | null;

  @ApiProperty({
    description: 'User created at',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'User geolocation',
    example: { lat: 42, lng: 42 },
  })
  geolocation!: GeolocationDto | null;

  @ApiProperty({
    description: 'User avatars',
    example: [{ id: '1', path: '/path/to/avatar.png' }],
  })
  avatars!: AvatarDto[];
}
