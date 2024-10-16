import type { User } from '@prisma/client';
import { IsBoolean, IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto implements Pick<User, 'email' | 'password'> {
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
  password!: string;

  @IsBoolean()
  rememberMe!: boolean;
}
