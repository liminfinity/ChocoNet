import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type {
  DeleteVerificationCodeRequest,
  SaveVerificationCodeRequest,
  UpdateVerificationCodeRequest,
  VerifyCodeRequest,
} from '../types';
import { VerificationCodeType } from '@prisma/client';
import {
  VERIFICATION_CODE_EXPIRATION_TIME,
  VERIFICATION_CODE_REQUEST_INTERVAL,
} from '../constants';

@Injectable()
export class VerificationCodeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async save(verificationCodeDto: SaveVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.create({
      data: verificationCodeDto,
    });
  }

  async update({ code, ...verificationCodeFilter }: UpdateVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.update({
      where: {
        type_email: verificationCodeFilter,
      },
      data: { code },
    });
  }

  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.delete({
      where: {
        type_email: verificationCodeDto,
      },
    });
  }

  async verify({ code, ...verificationCodeFilter }: VerifyCodeRequest): Promise<boolean> {
    const verificationCode = await this.databaseService.verificationCode.findUnique({
      where: {
        type_email: verificationCodeFilter,
        code,
        updatedAt: {
          lte: new Date(Date.now() - VERIFICATION_CODE_EXPIRATION_TIME),
        },
      },
    });
    return !!verificationCode;
  }

  async isCodeRequestAllowed(email: string, type: VerificationCodeType): Promise<boolean> {
    const verificationCode = await this.databaseService.verificationCode.findUnique({
      where: {
        type_email: {
          email,
          type,
        },
        updatedAt: {
          lte: new Date(Date.now() - VERIFICATION_CODE_REQUEST_INTERVAL),
        },
      },
    });
    return !!verificationCode;
  }

  async isEmailConfirmed(email: string, type: VerificationCodeType): Promise<boolean> {
    const verificationCode = await this.databaseService.verificationCode.findUnique({
      where: {
        type_email: {
          email,
          type,
        },
      },
    });
    return !verificationCode;
  }

  async deleteExpiredCodes(): Promise<void> {
    await this.databaseService.verificationCode.deleteMany({
      where: {
        updatedAt: {
          lte: new Date(Date.now() - VERIFICATION_CODE_EXPIRATION_TIME),
        },
      },
    });
  }
}
