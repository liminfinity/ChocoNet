import { Injectable } from '@nestjs/common';
import { VerificationCodeRepository } from '../repositories';
import {
  DeleteVerificationCodeRequest,
  VerifyCodeRequest,
  SaveVerificationCodeRequest,
} from '../types';
import { randint } from '@/common/lib';

@Injectable()
export class VerificationCodeService {
  constructor(private readonly verificationCodeRepository: VerificationCodeRepository) {}

  async saveEmailConfirmationCode(
    emailConfirmationDto: SaveVerificationCodeRequest,
  ): Promise<void> {
    await this.verificationCodeRepository.saveEmailConfirmationCode(emailConfirmationDto);
  }

  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.delete(verificationCodeDto);
  }

  async verify(verificationCodeDto: VerifyCodeRequest): Promise<void> {
    await this.verificationCodeRepository.verify(verificationCodeDto);
  }

  async isEmailConfirmed(email: string): Promise<boolean> {
    return this.verificationCodeRepository.isEmailConfirmed(email);
  }

  generateVerificationCode(): string {
    return randint(100_000, 999_999).toString();
  }
}
