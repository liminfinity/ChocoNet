import { VerificationCode } from '@prisma/client';
import { IsEmail } from 'class-validator';

export class RequestCodeDto implements Pick<VerificationCode, 'email'> {
  @IsEmail()
  email!: string;
}
