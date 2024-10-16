import { Injectable, NotFoundException } from '@nestjs/common';
import type { LoginDto } from '../dto';
import { HashService } from '@/common/modules';
import type { LoginServiceResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategies';
import {
  ENV,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from '../constants';
import { RefreshTokenService } from '@/modules/refreshToken';
import { UserService } from '@/modules/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
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

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        issuer: ENV.JWT_ISSUER,
      }),
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        issuer: ENV.JWT_ISSUER,
      }),
    ]);

    await this.refreshTokenService.save({
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
    return this.refreshTokenService.deleteByToken(refreshToken);
  }
}
