import { EmailDto } from '@/common/dto';
import { VerificationCode } from '@prisma/client';
import { IsNumberString } from 'class-validator';

export class VerifyCodeDto extends EmailDto implements Pick<VerificationCode, 'code'> {
  @IsNumberString()
  code!: string;
}
