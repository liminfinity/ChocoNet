import type { User } from '@prisma/client';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 0,
      minUppercase: 0,
    },
    {
      message:
        'Password should be at least 8 characters long and contain at least one number and one symbol',
    },
  )
  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsBoolean()
  rememberMe!: boolean;
}
