import { Injectable, NotFoundException } from '@nestjs/common';
import type { LoginDto } from '../dto';
import { HashService } from '@/common/modules';
import { AuthRepository } from '../repositories';
import type { LoginServiceResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategies';
import {
  ENV,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginServiceResponse> {
    const user = await this.authRepository.findByEmail(loginDto.email);
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

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
}
