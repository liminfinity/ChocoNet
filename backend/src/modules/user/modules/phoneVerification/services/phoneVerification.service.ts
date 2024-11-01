import { SmsService } from '@/common/modules';
import { VerificationCodeService } from '@/modules/auth/modules';
import { UserService } from '@/modules/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import { createVerificationSms } from '../lib';
import { PhoneVerificationRepository } from '../repositories';
import { deletePlusFromPhone } from '@/common/lib';

@Injectable()
export class PhoneVerificationService {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
  ) {}

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
