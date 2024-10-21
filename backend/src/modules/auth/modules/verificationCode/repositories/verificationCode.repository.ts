import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type {
  DeleteVerificationCodeRequest,
  SaveVerificationCodeRequest,
  VerifyCodeRequest,
} from '../types';
import { VerificationCodeType } from '@prisma/client';

@Injectable()
export class VerificationCodeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveEmailConfirmationCode(
    emailConfirmationDto: SaveVerificationCodeRequest,
  ): Promise<void> {
    await this.databaseService.verificationCode.create({
      data: {
        ...emailConfirmationDto,
        type: VerificationCodeType.EMAIL_CONFIRMATION,
      },
    });
  }

  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.delete({
      where: {
        code_email: verificationCodeDto,
      },
    });
  }

  async verify(verificationCodeDto: VerifyCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.findUnique({
      where: {
        code_email: verificationCodeDto,
      },
    });
  }

  async isEmailConfirmed(email: string): Promise<boolean> {
    const verificationCode = await this.databaseService.verificationCode.findFirst({
      where: {
        email,
        type: VerificationCodeType.EMAIL_CONFIRMATION,
      },
    });
    return !verificationCode;
  }
}
