import { UserService } from '@/modules/user';
import { AuthService } from '../auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JwtTokenService, VerificationCodeService } from '../../modules';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCreateUser,
  mockLogin,
  mockNewTokens,
  mockPayload,
  mockRegister,
  mockRequestNewCode,
  mockUser,
  mockVerifyCode,
} from './mocks';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '@/common/modules';
import { MailerService } from '@nestjs-modules/mailer';
import omit from 'lodash.omit';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { VerificationCodeType } from '@prisma/client';

describe('Сервис аутентификации', () => {
  let authService: AuthService;
  let userService: DeepMocked<UserService>;
  let jwtTokenService: DeepMocked<JwtTokenService>;
  let verificationCodeService: DeepMocked<VerificationCodeService>;
  let hashService: DeepMocked<HashService>;
  let mailerService: DeepMocked<MailerService>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = moduleFixtures.get(AuthService);
    userService = moduleFixtures.get(UserService);
    jwtTokenService = moduleFixtures.get(JwtTokenService);
    verificationCodeService = moduleFixtures.get(VerificationCodeService);
    hashService = moduleFixtures.get(HashService);
    mailerService = moduleFixtures.get(MailerService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Логин', () => {
    it('Если пользователя с таким email не существует - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(null);
      await expect(authService.login(mockLogin)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Если пароль не совпадает - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);
      await expect(authService.login(mockLogin)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Если email не подтвержден - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      verificationCodeService.isEmailConfirmed.mockResolvedValue(false);

      await expect(authService.login(mockLogin)).rejects.toThrow(
        new ForbiddenException('Email not confirmed'),
      );
    });

    it('Если успешно - возвращает пользователя, access и refresh токены', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      verificationCodeService.isEmailConfirmed.mockResolvedValue(true);
      jwtTokenService.generateTokens.mockResolvedValue(mockNewTokens);
      jwtTokenService.saveRefreshToken.mockResolvedValue({
        id: mockNewTokens.refreshToken,
      });

      const result = await authService.login(mockLogin);

      expect(result.user).toEqual(omit(mockUser, ['password', 'id']));
      expect(result.accessToken).toEqual(mockNewTokens.accessToken);
      expect(result.refreshToken).toEqual(mockNewTokens.refreshToken);
    });
  });

  describe('Выход из аккаунта', () => {
    it('Если refresh токен не передан - ошибка', async () => {
      await expect(authService.logout()).rejects.toThrow(
        new UnauthorizedException('Refresh token not found'),
      );
    });
    it('Успешный выход', async () => {
      jwtTokenService.deleteRefreshToken.mockResolvedValue();
      await authService.logout(mockNewTokens.refreshToken);
      expect(jwtTokenService.deleteRefreshToken).toHaveBeenCalledWith(mockNewTokens.refreshToken);
    });
  });

  describe('Обновление', () => {
    it('Если refresh token не передан - ошибка', async () => {
      await expect(authService.refresh()).rejects.toThrow(
        new UnauthorizedException('Refresh token not found'),
      );
    });

    it('Если refresh token устарел - ошибка', async () => {
      jwtTokenService.verifyRefreshToken.mockRejectedValue(
        new TokenExpiredError('test error', new Date()),
      );
      await expect(authService.refresh(mockNewTokens.refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Если refresh token некорректен - ошибка', async () => {
      jwtTokenService.verifyRefreshToken.mockRejectedValue(new JsonWebTokenError('test error'));
      await expect(authService.refresh('token')).rejects.toThrow(UnauthorizedException);
    });

    it('Если пользователь не найден - ошибка', async () => {
      jwtTokenService.verifyRefreshToken.mockResolvedValue(mockPayload);
      userService.findById.mockResolvedValue(null);
      await expect(authService.refresh(mockNewTokens.refreshToken)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Если email не подтвержден - ошибка', async () => {
      jwtTokenService.verifyRefreshToken.mockResolvedValue(mockPayload);
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.isEmailConfirmed.mockResolvedValue(false);
      await expect(authService.refresh(mockNewTokens.refreshToken)).rejects.toThrow(
        new ForbiddenException('Email not confirmed'),
      );
    });

    it('Если успешно - возвращает пользователя, access и refresh токены', async () => {
      jwtTokenService.verifyRefreshToken.mockResolvedValue(mockPayload);
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.isEmailConfirmed.mockResolvedValue(true);
      jwtTokenService.generateTokens.mockResolvedValue(mockNewTokens);

      const result = await authService.refresh(mockNewTokens.refreshToken);

      expect(result.user).toEqual(omit(mockUser, ['password', 'id']));
      expect(result.accessToken).toEqual(mockNewTokens.accessToken);
      expect(result.refreshToken).toEqual(mockNewTokens.refreshToken);
    });
  });

  describe('Регистрация', () => {
    it('Если email уже зарегистрирован - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      await expect(authService.register(mockRegister)).rejects.toThrow(
        new ConflictException('User already exists'),
      );
    });
    it('Успешная регистрация', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(mockCreateUser);
      verificationCodeService.save.mockResolvedValue();
      mailerService.sendMail.mockResolvedValue(null);

      await authService.register(mockRegister);

      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(mockRegister.email);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(verificationCodeService.save).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('Подтверждение кода', () => {
    it('Если email или код неверны - ошибка', async () => {
      verificationCodeService.verify.mockResolvedValue(false);
      await expect(authService.verifyCode(mockVerifyCode)).rejects.toThrow(
        new BadRequestException('Invalid code'),
      );
    });

    it('Если пользователь не найден - ошибка', async () => {
      verificationCodeService.verify.mockResolvedValue(true);
      verificationCodeService.delete.mockResolvedValue();
      userService.findByEmail.mockResolvedValue(null);
      await expect(authService.verifyCode(mockVerifyCode)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Если успешно - возвращает пользователя, access и refresh токены', async () => {
      verificationCodeService.verify.mockResolvedValue(true);
      verificationCodeService.delete.mockResolvedValue();
      userService.findByEmail.mockResolvedValue(mockUser);
      jwtTokenService.generateTokens.mockResolvedValue(mockNewTokens);

      const result = await authService.verifyCode(mockVerifyCode);

      expect(result.user).toEqual(omit(mockUser, ['password', 'id']));
      expect(result.accessToken).toEqual(mockNewTokens.accessToken);
      expect(result.refreshToken).toEqual(mockNewTokens.refreshToken);
    });
  });

  describe('Запрос нового кода', () => {
    it('Если пользователь не найден - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(null);
      await expect(authService.requestNewCode(mockRequestNewCode)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('Если еще нельзя запрашивать код - ошибка', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      verificationCodeService.isCodeRequestAllowed.mockResolvedValue(false);
      await expect(authService.requestNewCode(mockRequestNewCode)).rejects.toThrow(
        new BadRequestException('You must wait before requesting a new code'),
      );
    });
    it('Если успешно - запрашивает новый код', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      verificationCodeService.isCodeRequestAllowed.mockResolvedValue(true);
      verificationCodeService.update.mockResolvedValue();
      verificationCodeService.generateVerificationCode.mockReturnValue(mockVerifyCode.code);
      mailerService.sendMail.mockResolvedValue(null);
      await authService.requestNewCode(mockRequestNewCode);

      expect(verificationCodeService.update).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(verificationCodeService.update).toHaveBeenCalledWith({
        email: mockRequestNewCode.email,
        code: mockVerifyCode.code,
        type: VerificationCodeType.EMAIL_CONFIRMATION,
      });
    });
  });
});
