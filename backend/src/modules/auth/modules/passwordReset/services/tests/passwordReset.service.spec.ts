import { UserService } from '@/modules/user';
import { VerificationCodeService } from '../../../verificationCode';
import { PasswordResetService } from '../passwordReset.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtTokenService } from '../../../jwtToken';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  mockEmail,
  mockNewTokens,
  mockRequestNewCode,
  mockUpdatePassword,
  mockUser,
  mockVerificationCode,
  mockVerifyCode,
} from './mocks';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import { mapUserToDto } from '@/modules/user/lib';

describe('Сервис сброса пароля', () => {
  let passwordResetService: PasswordResetService;
  let verificationCodeService: DeepMocked<VerificationCodeService>;
  let userService: DeepMocked<UserService>;
  let mailerService: DeepMocked<MailerService>;
  let jwtTokenService: DeepMocked<JwtTokenService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetService],
    })
      .useMocker(createMock)
      .compile();

    passwordResetService = app.get(PasswordResetService);
    verificationCodeService = app.get(VerificationCodeService);
    userService = app.get(UserService);
    mailerService = app.get(MailerService);
    jwtTokenService = app.get(JwtTokenService);
  });

  describe('Отправка электронной почты', () => {
    it('Успешная отправка электронной почты', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      verificationCodeService.generateVerificationCode.mockReturnValue(mockVerificationCode);
      verificationCodeService.save.mockResolvedValue();
      mailerService.sendMail.mockResolvedValue(null);

      await passwordResetService.sendEmail(mockEmail);
      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(verificationCodeService.generateVerificationCode).toHaveBeenCalledTimes(1);
      expect(verificationCodeService.save).toHaveBeenCalledTimes(1);
      expect(verificationCodeService.save).toHaveBeenCalledWith({
        code: mockVerificationCode,
        email: mockEmail,
        type: VerificationCodeType.PASSWORD_RESET,
      });
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('Пользователь не найден - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(passwordResetService.sendEmail(mockEmail)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Отправка кода', () => {
    it('Пользователь не найден - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(passwordResetService.requestNewCode(mockRequestNewCode)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Код не доступен для запроса - ошибка', async () => {
      verificationCodeService.isCodeRequestAllowed.mockResolvedValue(false);

      await expect(passwordResetService.requestNewCode(mockRequestNewCode)).rejects.toThrow(
        new BadRequestException('You must wait before requesting a new code'),
      );
    });

    it('Отправка почты с кодом', async () => {
      verificationCodeService.generateVerificationCode.mockReturnValue(mockVerificationCode);
      verificationCodeService.save.mockResolvedValue();
      mailerService.sendMail.mockResolvedValue(null);

      await passwordResetService.requestNewCode(mockRequestNewCode);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockRequestNewCode.email,
          subject: 'Сброс пароля',
          context: {
            verificationCode: mockVerificationCode,
          },
        }),
      );
    });
  });

  describe('Подтверждение кода', () => {
    it('Код неверен - ошибка', async () => {
      verificationCodeService.verify.mockResolvedValue(false);

      await expect(passwordResetService.verifyCode(mockVerifyCode)).rejects.toThrow(
        new BadRequestException('Invalid code'),
      );
    });

    it('Удаление кода, если верен', async () => {
      verificationCodeService.verify.mockResolvedValue(true);
      verificationCodeService.delete.mockResolvedValue();

      await passwordResetService.verifyCode(mockVerifyCode);

      expect(verificationCodeService.delete).toHaveBeenCalledTimes(1);
      expect(verificationCodeService.delete).toHaveBeenCalledWith({
        email: mockVerifyCode.email,
        type: VerificationCodeType.PASSWORD_RESET,
      });
    });
  });

  describe('Обновление пароля', () => {
    it('Если пользователь не подтвердил email - ошибка', async () => {
      verificationCodeService.isEmailConfirmed.mockResolvedValue(false);

      await expect(passwordResetService.updatePassword(mockUpdatePassword)).rejects.toThrow(
        new ForbiddenException('Email not confirmed'),
      );
    });

    it('Пользователь не найден - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(passwordResetService.updatePassword(mockUpdatePassword)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Успешное обновление пароля', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      userService.updatePassword.mockResolvedValue();

      await passwordResetService.updatePassword(mockUpdatePassword);

      expect(userService.updatePassword).toHaveBeenCalledTimes(1);
      expect(userService.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        mockUpdatePassword.newPassword,
      );
    });

    it('Удаление всех токенов при выходе из других устройств', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      userService.updatePassword.mockResolvedValue();
      jwtTokenService.deleteRefreshTokensByUserId.mockResolvedValue();

      await passwordResetService.updatePassword({
        ...mockUpdatePassword,
        logoutFromOtherDevices: true,
      });

      expect(jwtTokenService.deleteRefreshTokensByUserId).toHaveBeenCalledTimes(1);
      expect(jwtTokenService.deleteRefreshTokensByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it('Возвращение обновленных данных и токенов', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      userService.updatePassword.mockResolvedValue();
      jwtTokenService.generateTokens.mockResolvedValue(mockNewTokens);

      const result = await passwordResetService.updatePassword(mockUpdatePassword);

      expect(result.user).toEqual(mapUserToDto(mockUser));
      expect(result.accessToken).toEqual(mockNewTokens.accessToken);
      expect(result.refreshToken).toEqual(mockNewTokens.refreshToken);
    });
  });
});
