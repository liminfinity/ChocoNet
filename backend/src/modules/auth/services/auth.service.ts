import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { LoginDto } from '../dto';
import { HashService } from '@/common/modules';
import type { LoginServiceResponse, RefreshServiceResponse } from './types';
import { JwtPayload } from '../modules/jwtTokens';
import { JwtTokensService } from '@/modules/auth/modules/jwtTokens';
import { UserService } from '@/modules/user';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userSerivce: UserService,
    private readonly jwtTokensService: JwtTokensService,
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

    const { accessToken, refreshToken } = await this.jwtTokensService.generateTokens(jwtPayload);

    await this.jwtTokensService.saveRefreshToken({
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
    return this.jwtTokensService.deleteRefreshToken(refreshToken);
  }

  async refresh(currentRefreshToken?: string): Promise<RefreshServiceResponse> {
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const { sub, email } = await this.jwtTokensService.verifyRefreshToken(currentRefreshToken);

      const user = await this.userSerivce.findById(sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = await this.jwtTokensService.generateTokens({
        sub,
        email,
      });

      await this.jwtTokensService.updateRefreshToken({
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
        await this.jwtTokensService.deleteRefreshToken(currentRefreshToken);
        throw new UnauthorizedException(error.message);
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
