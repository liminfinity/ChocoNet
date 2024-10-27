import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtTokenRepository } from '../repositories';
import {
  SaveRefreshTokenRequest,
  SaveRefreshTokenResponse,
  UpdateRefreshTokenRequest,
} from '../types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import type { GenerateTokensResponse } from './types';
import { millisecondsToSeconds } from '@/common/lib';
import { Interval } from '@nestjs/schedule';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_REMOVAL_INTERVAL } from '../constants';

@Injectable()
export class JwtTokenService implements OnModuleInit {
  constructor(
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async saveRefreshToken(
    refreshTokenDto: SaveRefreshTokenRequest,
  ): Promise<SaveRefreshTokenResponse> {
    return this.jwtTokenRepository.saveRefreshToken(refreshTokenDto);
  }
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    return this.jwtTokenRepository.deleteRefreshToken(refreshToken);
  }

  async updateRefreshToken(updateRefreshTokenDto: UpdateRefreshTokenRequest): Promise<void> {
    return this.jwtTokenRepository.updateRefreshToken(updateRefreshTokenDto);
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(REFRESH_TOKEN_EXPIRATION_TIME),
    });
  }
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(ACCESS_TOKEN_EXPIRATION_TIME),
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

  async onModuleInit(): Promise<void> {
    await this.jwtTokenRepository.deleteExpiredRefreshTokens();
  }

  @Interval(REFRESH_TOKEN_REMOVAL_INTERVAL)
  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.jwtTokenRepository.deleteExpiredRefreshTokens();
  }
}
