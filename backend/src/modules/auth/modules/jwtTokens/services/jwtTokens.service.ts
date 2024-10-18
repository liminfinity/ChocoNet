import { Injectable } from '@nestjs/common';
import { JwtTokensRepository } from '../repositories';
import {
  SaveRefreshTokenRequest,
  SaveRefreshTokenResponse,
  UpdateRefreshTokenRequest,
} from '../types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from '@/modules/auth/constants';
import type { GenerateTokensResponse } from './types';
import { millisecondsToSeconds } from '@/common/lib';

@Injectable()
export class JwtTokensService {
  constructor(
    private readonly jwtTokensRepository: JwtTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async saveRefreshToken(
    refreshTokenDto: SaveRefreshTokenRequest,
  ): Promise<SaveRefreshTokenResponse> {
    return this.jwtTokensRepository.saveRefreshToken(refreshTokenDto);
  }
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    return this.jwtTokensRepository.deleteRefreshToken(refreshToken);
  }

  async updateRefreshToken(updateRefreshTokenDto: UpdateRefreshTokenRequest): Promise<void> {
    return this.jwtTokensRepository.updateRefreshToken(updateRefreshTokenDto);
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });
  }
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });
  }

  async generateTokens(payload: JwtPayload): Promise<GenerateTokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verify(token);
  }
}
