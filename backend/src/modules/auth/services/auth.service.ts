import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { LoginDto, RegisterDto } from '../dto';
import { HashService } from '@/common/modules';
import type { LoginServiceResponse, RefreshServiceResponse } from './types';
import { JwtPayload } from '../modules/jwtToken';
import { JwtTokenService } from '../modules/jwtToken';
import { UserService } from '@/modules/user';
import { TokenExpiredError } from '@nestjs/jwt';
import { VerificationCodeService } from '../modules/verificationCode';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userSerivce: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginServiceResponse> {
    const user = await this.userSerivce.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    const isEqual = await this.hashService.compare(loginDto.password, password);
    if (!isEqual) {
      throw new NotFoundException('User not found');
    }

    const isConfirmed = await this.verificationCodeService.isEmailConfirmed(user.email);

    if (!isConfirmed) {
      throw new ForbiddenException('Email not confirmed');
    }

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

  async logout(refreshToken: string): Promise<void> {
    return this.jwtTokenService.deleteRefreshToken(refreshToken);
  }

  async refresh(currentRefreshToken?: string): Promise<RefreshServiceResponse> {
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const { sub, email } = await this.jwtTokenService.verifyRefreshToken(currentRefreshToken);

      const user = await this.userSerivce.findById(sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isConfirmed = await this.verificationCodeService.isEmailConfirmed(user.email);

      if (!isConfirmed) {
        throw new ForbiddenException('Email not confirmed');
      }

      const { accessToken, refreshToken } = await this.jwtTokenService.generateTokens({
        sub,
        email,
      });

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
    const existingUser = await this.userSerivce.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashService.hash(registerDto.password);

    const { email } = await this.userSerivce.create({
      ...registerDto,
      password: hashedPassword,
    });

    const verificationCode = this.verificationCodeService.generateVerificationCode();

    await this.verificationCodeService.saveEmailConfirmationCode({
      code: verificationCode,
      email,
    });


  }
}
