import { User } from '@prisma/client';
import { GeolocationDto } from './geolocation';
import { IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthDto } from './auth';

export class RegisterDto
  extends AuthDto
  implements Pick<User, 'firstName' | 'lastName' | 'phone' | 'about'>
{
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsString()
  about!: string | null;

  @ValidateNested()
  @Type(() => GeolocationDto)
  geolocation!: GeolocationDto;

  avatars!: Express.Multer.File[];
}
