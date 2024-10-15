import { Injectable, NotFoundException } from '@nestjs/common';
import type { LoginDto } from '../dto';
import { HashService } from 'src/common/modules';
import { AuthRepository } from '../repositories';
import type { LoginServiceResponse } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginServiceResponse> {
    const user = await this.authRepository.login(loginDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isEqual = await this.hashService.compare(loginDto.password, user.password);
    if (!isEqual) {
      throw new NotFoundException('User not found');
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '15m',
        issuer: process.env.JWT_ISSUER,
      }),
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
        issuer: process.env.JWT_ISSUER,
      }),
    ]);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}
