import { Injectable, OnModuleInit } from '@nestjs/common';
import { VerificationCodeRepository } from '../repositories';
import {
  DeleteVerificationCodeRequest,
  VerifyCodeRequest,
  SaveVerificationCodeRequest,
  UpdateVerificationCodeRequest,
} from '../types';
import { randint } from '@/common/lib';
import { Interval } from '@nestjs/schedule';
import { VERIFICATION_CODE_REMOVAL_INTERVAL } from '../constants';
import { VerificationCodeType } from '@prisma/client';

@Injectable()
export class VerificationCodeService implements OnModuleInit {
  constructor(private readonly verificationCodeRepository: VerificationCodeRepository) {}

  async save(emailConfirmationDto: SaveVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.save(emailConfirmationDto);
  }

  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.delete(verificationCodeDto);
  }

  async update(verificationCodeDto: UpdateVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.update(verificationCodeDto);
  }

  async verify(verificationCodeDto: VerifyCodeRequest): Promise<boolean> {
    return this.verificationCodeRepository.verify(verificationCodeDto);
  }

  async isEmailConfirmed(email: string, type: VerificationCodeType): Promise<boolean> {
    return this.verificationCodeRepository.isEmailConfirmed(email, type);
  }

  generateVerificationCode(length = 6): string {
    return randint(100_000, 999_999).toString().slice(0, length);
  }

  async onModuleInit(): Promise<void> {
    await this.verificationCodeRepository.deleteExpiredCodes();
  }

  @Interval(VERIFICATION_CODE_REMOVAL_INTERVAL)
  async deleteExpiredCodes(): Promise<void> {
    await this.verificationCodeRepository.deleteExpiredCodes();
  }

  async isCodeRequestAllowed(email: string, type: VerificationCodeType): Promise<boolean> {
    return this.verificationCodeRepository.isCodeRequestAllowed(email, type);
  }
}
