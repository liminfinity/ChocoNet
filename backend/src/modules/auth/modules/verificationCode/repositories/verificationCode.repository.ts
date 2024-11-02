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

  /**
   * Creates a new verification code.
   *
   * @param verificationCodeDto - The data for the verification code to be created.
   * @returns A promise that resolves when the verification code has been successfully created.
   */
  async save(verificationCodeDto: SaveVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.create({
      data: verificationCodeDto,
    });
  }

  /**
   * Updates the verification code for the given verification code filter.
   *
   * @param {UpdateVerificationCodeRequest} verificationCodeDto - The data for the verification code to be updated.
   * @returns A promise that resolves when the verification code has been successfully updated.
   */
  async update({ code, ...verificationCodeFilter }: UpdateVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.update({
      where: {
        type_email: verificationCodeFilter,
      },
      data: { code },
    });
  }

  /**
   * Deletes the verification code for the given verification code filter.
   *
   * @param verificationCodeDto - The filter for the verification code to be deleted.
   * @returns A promise that resolves when the verification code has been successfully deleted.
   */
  async delete(verificationCodeDto: DeleteVerificationCodeRequest): Promise<void> {
    await this.databaseService.verificationCode.delete({
      where: {
        type_email: verificationCodeDto,
      },
    });
  }

  /**
   * Verifies the given verification code for the given verification code filter.
   *
   * @param verificationCodeDto - The verification code and filter to be verified.
   * @returns A promise that resolves with a boolean indicating whether the verification code is valid or not.
   */
  async verify({ code, ...verificationCodeFilter }: VerifyCodeRequest): Promise<boolean> {
    const verificationCode = await this.databaseService.verificationCode.findUnique({
      where: {
        type_email: verificationCodeFilter,
        code,
        updatedAt: {
          gte: new Date(Date.now() - VERIFICATION_CODE_EXPIRATION_TIME),
        },
      },
    });
    return !!verificationCode;
  }

  /**
   * Checks if a verification code request is allowed for the given email and type.
   * This is used to prevent abuse by limiting the number of verification code requests that can be made within a given time period.
   * @param email - The email address to check.
   * @param type - The type of verification code.
   * @returns A promise that resolves with a boolean indicating whether the request is allowed.
   */
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

  /**
   * Checks if the given email has been confirmed for the given verification code type.
   * @param email - The email address to check.
   * @param type - The type of verification code.
   * @returns A promise that resolves with a boolean indicating whether the email has been confirmed or not.
   */
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

  /**
   * Deletes all expired verification codes from the database.
   *
   * @returns A promise that resolves when all expired verification codes are deleted.
   */
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
