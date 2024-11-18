import { EmailDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationCode } from '@prisma/client';
import { IsNumberString } from 'class-validator';

export class VerifyCodeDto extends EmailDto implements Pick<VerificationCode, 'code'> {
  @ApiProperty({
    description: 'Verification code',
    example: '123456',
    required: true,
  })
  @IsNumberString()
  code!: string;
}
