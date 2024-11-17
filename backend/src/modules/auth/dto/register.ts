import { User } from '@prisma/client';
import { IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthDto } from './auth';
import { ApiProperty } from '@nestjs/swagger';
import { GeolocationDto } from '@/modules/user/dto';
import { IsNickname } from '../decorators';

export class RegisterDto
  extends AuthDto
  implements Pick<User, 'firstName' | 'lastName' | 'nickname' | 'phone' | 'about'>
{
  @ApiProperty({
    description: 'User nickname',
    example: 'JohnDoe',
    required: true,
  })
  @IsNickname()
  nickname!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: true,
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: true,
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '123456789',
    required: true,
  })
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({
    description: 'User about',
    example: 'About John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  about!: string | null;

  @ApiProperty({
    description: 'User geolocation',
    example: {
      lat: 42,
      lng: 42,
    },
    required: true,
  })
  @ValidateNested()
  @Type(() => GeolocationDto)
  geolocation!: GeolocationDto;

  @ApiProperty({
    description: 'User avatars',
    example: [],
    format: 'binary',
    required: true,
  })
  avatars!: Express.Multer.File[];
}
