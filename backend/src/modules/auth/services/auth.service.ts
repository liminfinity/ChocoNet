import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { LoginDto, RegisterDto, RequestCodeDto, VerifyCodeDto } from '../dto';
import { HashService } from '@/common/modules';
import type {
  LoginServiceResponse,
  RefreshServiceResponse,
  VerifyCodeServiceResponse,
} from './types';
import { JwtPayload } from '../modules/jwtToken';
import { JwtTokenService } from '../modules/jwtToken';
import { UserService } from '@/modules/user';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { VerificationCodeService } from '../modules/verificationCode';
import { MailerService } from '@nestjs-modules/mailer';
import { createConfirmationMail } from '../lib';
import omit from 'lodash.omit';
import { VerificationCodeType } from '@prisma/client';
import { mapFilesToFilenames } from '@/common/lib';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Logins a user with the given email and password.
   * @throws {NotFoundException} If user with the given email is not found.
   * @throws {ForbiddenException} If the user is not confirmed.
   * @returns {Promise<LoginServiceResponse>} The user without password, access token and refresh token.
   */
  async login(loginDto: LoginDto): Promise<LoginServiceResponse> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, id, ...userWithoutPassword } = user;

    const isPasswordCorrect = await this.hashService.compare(loginDto.password, password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('User not found');
    }

    const isConfirmed = await this.verificationCodeService.isEmailConfirmed(
      user.email,
      VerificationCodeType.EMAIL_CONFIRMATION,
    );

    if (!isConfirmed) {
      throw new ForbiddenException('Email not confirmed');
    }

    const jwtPayload: JwtPayload = {
      sub: id,
      email: user.email,
    };

    const { accessToken, refreshToken } = await this.jwtTokenService.generateTokens(jwtPayload);

    await this.jwtTokenService.saveRefreshToken({
      userId: id,
      token: refreshToken,
    });

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Invalidates the refresh token, so that it can't be used for login anymore.
   * @param refreshToken - The refresh token to invalidate. If not provided, an UnauthorizedException is thrown.
   * @throws UnauthorizedException - If refreshToken is not provided.
   */
  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return this.jwtTokenService.deleteRefreshToken(refreshToken);
  }

  /**
   * Refreshes the access token and refresh token with new ones.
   * @throws {UnauthorizedException} If the refresh token is not provided, expired or invalid.
   * @throws {ForbiddenException} If the email is not confirmed.
   * @param currentRefreshToken The current refresh token. If not provided, an UnauthorizedException is thrown.
   * @returns {Promise<RefreshServiceResponse>} The new access token, refresh token and user.
   */
  async refresh(currentRefreshToken?: string): Promise<RefreshServiceResponse> {
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const { sub, email } = await this.jwtTokenService.verifyRefreshToken(currentRefreshToken);

      const user = await this.userService.findById(sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userWithoutPassword = omit(user, ['password', 'id']);

      const isConfirmed = await this.verificationCodeService.isEmailConfirmed(
        user.email,
        VerificationCodeType.EMAIL_CONFIRMATION,
      );

      if (!isConfirmed) {
        throw new ForbiddenException('Email not confirmed');
      }

      const jwtPayload: JwtPayload = {
        sub,
        email,
      };

      const { accessToken, refreshToken } = await this.jwtTokenService.generateTokens(jwtPayload);

      await this.jwtTokenService.updateRefreshToken({
        oldToken: currentRefreshToken,
        newToken: refreshToken,
      });

      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
        await this.jwtTokenService.deleteRefreshToken(currentRefreshToken);
        throw new UnauthorizedException(error.message);
      } else {
        throw error;
      }
    }
  }

  /**
   * Registers a new user with the given details.
   * @param registerDto - The details of the new user to register.
   * @throws ConflictException If a user with the same email already exists.
   */
  async register(registerDto: RegisterDto): Promise<void> {
    const emailExistingUser = await this.userService.findByEmail(registerDto.email);
    if (emailExistingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const nicknameExistingUser = await this.userService.findByNickname(registerDto.nickname);
    if (nicknameExistingUser) {
      throw new ConflictException('User with this nickname already exists');
    }

    const { email } = await this.userService.create({
      ...registerDto,
      avatars: mapFilesToFilenames(registerDto.avatars),
    });

    const verificationCode = this.verificationCodeService.generateVerificationCode();

    await this.verificationCodeService.save({
      code: verificationCode,
      email,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });

    const confirmationMail = createConfirmationMail(email, verificationCode);

    await this.mailerService.sendMail(confirmationMail);
  }

  /**
   * Verifies the provided email confirmation code and, if valid, generates new access and refresh tokens.
   * @param code - The email confirmation code to verify.
   * @param email - The email associated with the confirmation code.
   * @returns {Promise<VerifyCodeServiceResponse>} An object containing the user details without the password, and new access and refresh tokens.
   * @throws {BadRequestException} If the confirmation code is invalid.
   * @throws {NotFoundException} If the user associated with the email is not found.
   */
  async verifyCode({ code, email }: VerifyCodeDto): Promise<VerifyCodeServiceResponse> {
    const isVerified = await this.verificationCodeService.verify({
      email,
      code,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });

    if (!isVerified) {
      throw new BadRequestException('Invalid code');
    }

    await this.verificationCodeService.delete({
      email,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
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
      VerificationCodeType.EMAIL_CONFIRMATION,
    );

    if (!isRequestAllowed) {
      throw new BadRequestException('You must wait before requesting a new code');
    }

    const verificationCode = this.verificationCodeService.generateVerificationCode();

    await this.verificationCodeService.update({
      code: verificationCode,
      email,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });

    const confirmationMail = createConfirmationMail(email, verificationCode);

    await this.mailerService.sendMail(confirmationMail);
  }
}
