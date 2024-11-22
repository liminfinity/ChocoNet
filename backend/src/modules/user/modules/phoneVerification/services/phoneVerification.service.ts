import { SmsService } from '@/common/modules';
import { VerificationCodeService } from '@/modules/auth/modules';
import { UserService } from '@/modules/user';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import { createVerificationSms } from '../lib';
import { PhoneVerificationRepository } from '../repositories';
import { deletePlusFromPhone } from '@/common/lib';

@Injectable()
export class PhoneVerificationService {
  /**
   * Creates an instance of the PhoneVerificationService.
   *
   * @param userService The user service
   * @param smsService The sms service
   * @param verificationCodeService The verification code service
   * @param phoneVerificationRepository The phone verification repository
   */
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
  ) {}

  /**
   * Generates a new verification code and sends it to the user's phone.
   * Also, saves the verification code to the database.
   * @param userId The user's id
   * @throws NotFoundException If the user is not found
   */
  async getCode(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { phone, email } = user;

    const verifcationCode = this.verificationCodeService.generateVerificationCode(3);

    await this.verificationCodeService.save({
      code: verifcationCode,
      email,
      type: VerificationCodeType.PHONE_CONFIRMATION,
    });

    const verificationSms = createVerificationSms(verifcationCode);

    await this.smsService.sendSms(deletePlusFromPhone(phone), verificationSms);

    await this.phoneVerificationRepository.create(userId);
  }

  /**
   * Verifies the given code for the given user.
   * @param code The verification code
   * @param userId The user's id
   * @throws NotFoundException If the user is not found or the code is not valid
   */
  async verifyCode(code: string, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email } = user;

    const isVerified = await this.verificationCodeService.verify({
      email,
      code,
      type: VerificationCodeType.PHONE_CONFIRMATION,
    });

    if (!isVerified) {
      throw new NotFoundException('Code is not valid');
    }

    await this.verificationCodeService.delete({
      email: user.email,
      type: VerificationCodeType.PHONE_CONFIRMATION,
    });

    await this.phoneVerificationRepository.update(userId, true);
  }

  /**
   * Requests a new verification code for the given user.
   * @param userId The user's id
   * @throws NotFoundException If the user is not found
   */
  async requestNewCode(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { phone, email } = user;

    const verifcationCode = this.verificationCodeService.generateVerificationCode(3);

    await this.verificationCodeService.update({
      code: verifcationCode,
      email,
      type: VerificationCodeType.PHONE_CONFIRMATION,
    });

    const verificationSms = createVerificationSms(verifcationCode);

    await this.smsService.sendSms(deletePlusFromPhone(phone), verificationSms);
  }
}
