import { IsNickname } from '@/modules/auth/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { GeolocationDto } from './geolocation.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto
  implements Partial<Omit<User, 'createdAt' | 'updatedAt' | 'id' | 'password'>>
{
  @ApiProperty({
    description: 'User email',
    type: 'string',
    example: '9G8L1@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string | undefined;

  @ApiProperty({
    description: 'User nickname',
    type: 'string',
    example: 'JohnDoe',
    required: false,
  })
  @IsOptional()
  @IsNickname()
  nickname?: string | undefined;

  @ApiProperty({
    description: 'User first name',
    type: 'string',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string | undefined;

  @ApiProperty({
    description: 'User last name',
    type: 'string',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string | undefined;

  @ApiProperty({
    description: 'User phone number',
    type: 'string',
    example: '123456789',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string | undefined;

  @ApiProperty({
    description: 'User about',
    type: 'string',
    example: 'About John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  about?: string | undefined;

  @ApiProperty({
    description: 'User geolocation',
    type: GeolocationDto,
    example: { lat: 42, lng: 42 },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeolocationDto)
  geolocation?: GeolocationDto | undefined;

  @ApiProperty({
    description: 'Id of user avatars to remove',
    type: 'array',
    items: { type: 'string' },
    example: ['123e4567-e89b-12d3-a456-426655440000'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  avatarsToRemove?: string[];

  @ApiProperty({
    description: 'User avatars',
    type: 'array',
    format: 'binary',
    example: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  avatars?: Express.Multer.File[] | undefined;
}
