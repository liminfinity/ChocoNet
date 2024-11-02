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

  /**
   * Save a verification code for a user.
   * @param emailConfirmationDto
   */
  async save(emailConfirmationDto: SaveVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.save(emailConfirmationDto);
  }

  /**
   * Deletes a verification code from the repository.
   * @param verificationCodeDto - The data transfer object containing the details of the verification code to delete.
   * @returns A promise that resolves when the verification code has been deleted.
   */
  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.delete(verificationCodeDto);
  }

  /**
   * Updates a verification code.
   * @param verificationCodeDto - The data transfer object containing the verification code details to update.
   * @returns A promise that resolves when the verification code has been updated.
   */
  async update(verificationCodeDto: UpdateVerificationCodeRequest): Promise<void> {
    await this.verificationCodeRepository.update(verificationCodeDto);
  }

  /**
   * Verify a verification code for a user.
   * @param verificationCodeDto - The data transfer object containing the verification code to verify.
   * @returns A promise that resolves with a boolean indicating whether the verification code was valid.
   */

  /**
   * Verifies a verification code for a user.
   * @param verificationCodeDto - The data transfer object containing the verification code to verify.
   * @returns A promise that resolves with a boolean indicating whether the verification code was valid.
   */
  async verify(verificationCodeDto: VerifyCodeRequest): Promise<boolean> {
    return this.verificationCodeRepository.verify(verificationCodeDto);
  }

  /**
   * Checks if the email has been confirmed for a given verification code type.
   * @param email - The email address to check.
   * @param type - The type of verification code.
   * @returns A promise that resolves with a boolean indicating whether the email is confirmed.
   */

  async isEmailConfirmed(email: string, type: VerificationCodeType): Promise<boolean> {
    return this.verificationCodeRepository.isEmailConfirmed(email, type);
  }

  /**
   * Generates a verification code of the given length.
   * @param length - The length of the verification code to generate. Defaults to 6.
   * @returns A string containing the verification code.
   */
  generateVerificationCode(length = 6): string {
    return randint(100_000, 999_999).toString().slice(0, length);
  }

  /**
   * Removes expired verification codes on service initialization.
   * @returns A promise that resolves when expired verification codes have been removed.
   */
  async onModuleInit(): Promise<void> {
    await this.verificationCodeRepository.deleteExpiredCodes();
  }

  /**
   * Removes expired verification codes.
   * This is called periodically to remove expired verification codes.
   * @returns A promise that resolves when expired verification codes have been removed.
   */
  @Interval(VERIFICATION_CODE_REMOVAL_INTERVAL)
  async deleteExpiredCodes(): Promise<void> {
    await this.verificationCodeRepository.deleteExpiredCodes();
  }

  /**
   * Checks if a verification code request is allowed for the given email and type.
   * This is used to prevent abuse by limiting the number of verification code requests that can be made within a given time period.
   * @param email - The email address to check.
   * @param type - The type of verification code.
   * @returns A promise that resolves with a boolean indicating whether the request is allowed.
   */
  async isCodeRequestAllowed(email: string, type: VerificationCodeType): Promise<boolean> {
    return this.verificationCodeRepository.isCodeRequestAllowed(email, type);
  }
}

