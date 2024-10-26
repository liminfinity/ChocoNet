import { VerificationCode } from '@prisma/client';
import { IsEmail, IsNumberString } from 'class-validator';

export class VerifyCodeDto implements Pick<VerificationCode, 'code' | 'email'> {
  @IsEmail()
  email!: string;

  @IsNumberString()
  code!: string;
}
