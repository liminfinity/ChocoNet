import { ApiProperty } from '@nestjs/swagger';
import { Geolocation, User } from '@prisma/client';
import { AvatarDto } from './avatar.dto';

class ContactDto implements Pick<User, 'email' | 'phone'> {
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
    description: 'User phone number verification status',
    example: true,
  })
  phoneVerified!: boolean;
}

class CountableValuesDto {
  @ApiProperty({
    description: 'User followers count',
    example: 42,
  })
  followers!: number;

  @ApiProperty({
    description: 'User following count',
    example: 42,
  })
  following!: number;

  @ApiProperty({
    description: 'User pastries count',
    example: 42,
  })
  pastries!: number;

  @ApiProperty({
    description: 'User likes count',
    example: 42,
  })
  likes!: number;
}

class GeolocationDto implements Pick<Geolocation, 'lat' | 'lng'> {
  @ApiProperty({
    description: 'User geolocation latitude',
    example: 42,
  })
  lat!: number;
  @ApiProperty({
    description: 'User geolocation longitude',
    example: 42,
  })
  lng!: number;

  @ApiProperty({
    description: 'User geolocation formatted address',
    example: 'Address',
  })
  formatted!: string;
}

export class GetGuestProfileDto
  implements Pick<User, 'nickname' | 'firstName' | 'lastName' | 'createdAt' | 'about'>
{
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
    description: 'User creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'User about',
    example: 'About John Doe',
  })
  about!: string | null;

  @ApiProperty({
    description: 'User countable values',
    type: CountableValuesDto,
    example: {
      followers: 42,
      following: 42,
      pastries: 42,
      likes: 42,
    },
  })
  _count!: CountableValuesDto;

  @ApiProperty({
    description: 'User avatars',
    type: [AvatarDto],
    example: [
      {
        id: '1',
        path: '/path/to/avatar.png',
      },
    ],
  })
  avatars!: AvatarDto[];
}

class GetAutorizedProfileDto extends GetGuestProfileDto {
  @ApiProperty({
    description: 'User contact',
    type: ContactDto,
    example: {
      email: 'john124@example.com',
      phone: '123456789',
      phoneVerified: true,
    },
  })
  contact!: ContactDto;

  @ApiProperty({
    description: 'User geolocation',
    type: GeolocationDto,
    examples: [
      {
        lat: 42,
        lng: 42,
        formatted: 'Address',
      },
      null,
    ],
  })
  geolocation!: GeolocationDto | null;
}

export class GetOtherProfileDto extends GetAutorizedProfileDto {
  @ApiProperty({
    description: 'User is following',
    example: true,
  })
  isFollowing!: boolean;
}

export class GetSelfProfileDto extends GetAutorizedProfileDto implements Pick<User, 'updatedAt'> {
  @ApiProperty({
    description: 'User update date',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
