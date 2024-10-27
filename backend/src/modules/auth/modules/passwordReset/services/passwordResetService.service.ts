import { UserService } from '@/modules/user';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerificationCodeService } from '../../verificationCode';
import { VerificationCodeType } from '@prisma/client';
import { createPasswordResetMail } from '../lib';
import { MailerService } from '@nestjs-modules/mailer';
import { RequestCodeDto, VerifyCodeDto } from '@/modules/auth/dto';
import { UpdatePasswordServiceRequest, UpdatePasswordServiceResponse } from './types';
import { JwtPayload, JwtTokenService } from '../../jwtToken';
import omit from 'lodash.omit';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async sendEmail(email: string): Promise<void> {
    const user = this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationCode = this.verificationCodeService.generateVerificationCode();

    await this.verificationCodeService.save({
      code: verificationCode,
      email,
      type: VerificationCodeType.PASSWORD_RESET,
    });

    const passwordResetMail = createPasswordResetMail(email, verificationCode);

    await this.mailerService.sendMail(passwordResetMail);
  }

  async verifyCode({ code, email }: VerifyCodeDto): Promise<void> {
    const isVerified = await this.verificationCodeService.verify({
      email,
      code,
      type: VerificationCodeType.PASSWORD_RESET,
    });

    if (!isVerified) {
      throw new BadRequestException('Invalid code');
    }

    await this.verificationCodeService.delete({
      email,
      type: VerificationCodeType.PASSWORD_RESET,
    });
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordServiceRequest,
  ): Promise<UpdatePasswordServiceResponse> {
    const { email, newPassword, logoutFromOtherDevices } = updatePasswordDto;

    const isConfirmed = await this.verificationCodeService.isEmailConfirmed(
      email,
      VerificationCodeType.PASSWORD_RESET,
    );

    if (!isConfirmed) {
      throw new ForbiddenException('Email not confirmed');
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updatePassword(email, newPassword);

    if (logoutFromOtherDevices) {
      await this.jwtTokenService.deleteRefreshTokensByUserId(user.id);
    }

    const userWithoutPassword = omit(user, ['password', 'id']);

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } = await this.jwtTokenService.generateTokens(jwtPayload);

    await this.jwtTokenService.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
    });

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
  async requestNewCode({ email }: RequestCodeDto): Promise<void> {
    const user = this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isRequestAllowed = await this.verificationCodeService.isCodeRequestAllowed(
      email,
      VerificationCodeType.PASSWORD_RESET,
    );

    if (!isRequestAllowed) {
      throw new BadRequestException('You must wait before requesting a new code');
    }

    const verificationCode = this.verificationCodeService.generateVerificationCode();

    await this.verificationCodeService.update({
      code: verificationCode,
      email,
      type: VerificationCodeType.PASSWORD_RESET,
    });

    const passwordResetMail = createPasswordResetMail(email, verificationCode);

    await this.mailerService.sendMail(passwordResetMail);
  }
}
