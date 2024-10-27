import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { TokenExpiredError } from '@nestjs/jwt';
import { VerificationCodeService } from '../modules/verificationCode';
import { MailerService } from '@nestjs-modules/mailer';
import { createConfirmationMail, mapFilesToFilenames } from '../lib';
import omit from 'lodash.omit';
import { VerificationCodeType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginServiceResponse> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, id, ...userWithoutPassword } = user;

    const isEqual = await this.hashService.compare(loginDto.password, password);
    if (!isEqual) {
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

  async logout(refreshToken: string): Promise<void> {
    return this.jwtTokenService.deleteRefreshToken(refreshToken);
  }

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
        user,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.jwtTokenService.deleteRefreshToken(currentRefreshToken);
        throw new UnauthorizedException(error.message);
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
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
  async requestNewCode({ email }: RequestCodeDto): Promise<void> {
    const user = this.userService.findByEmail(email);

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
