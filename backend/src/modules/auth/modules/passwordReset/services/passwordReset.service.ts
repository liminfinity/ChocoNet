import { UserService } from '@/modules/user';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { mapUserToDto } from '@/modules/user/lib';

@Injectable()
export class PasswordResetService {
  /**
   * Creates an instance of the PasswordResetService.
   *
   * @param userService The user service
   * @param verificationCodeService The verification code service
   * @param mailerService The mailer service
   * @param jwtTokenService The jwt token service
   */
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Sends an email with a password reset verification code to the given email.
   * @param email The email to send the password reset email to
   * @throws NotFoundException If the user associated with the email is not found
   */
  async sendEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);

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

  /**
   * Verifies the given code for the given email and, if valid, deletes the verification code
   * from the database.
   * @param verifyCodeDto The email and verification code to verify
   * @throws BadRequestException If the verification code is invalid
   */
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

  /**
   * Updates the user's password in the database.
   * @param updatePasswordDto The email, new password and logout from other devices flag
   * @throws ForbiddenException If the email is not confirmed
   * @throws NotFoundException If the user associated with the email is not found
   * @returns A promise that resolves when the password has been successfully updated, with the updated user details
   * without password, and new access and refresh tokens.
   */
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

    await this.userService.updatePassword(user.id, newPassword);

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
      user: mapUserToDto(userWithoutPassword),
      accessToken,
      refreshToken,
    };
  }
  /**
   * Requests a new verification code for the given email.
   * @param email The email address of the user to request a new verification code for
   * @throws NotFoundException If the user is not found
   * @throws BadRequestException If the user has requested a new verification code within the last 30 minutes
   */
  async requestNewCode({ email }: RequestCodeDto): Promise<void> {
    const user = await this.userService.findByEmail(email);

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
