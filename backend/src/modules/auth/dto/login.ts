import type { User } from '@prisma/client';
import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsString()
  @IsEmail(undefined, { message: 'Invalid email address' })
  email: string;

  @Matches(/"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  @IsString()
  password: string;

  constructor({ email, password }: Pick<User, 'email' | 'password'>) {
    this.email = email;
    this.password = password;
  }
}
