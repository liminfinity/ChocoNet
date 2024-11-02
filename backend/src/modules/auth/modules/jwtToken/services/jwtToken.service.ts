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
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_REMOVAL_INTERVAL,
} from '../constants';

@Injectable()
export class JwtTokenService implements OnModuleInit {
  /**
   * Constructor for JwtTokenService.
   *
   * @param jwtTokenRepository - The repository for managing refresh tokens.
   * @param jwtService - The service for generating and verifying JWTs.
   */
  constructor(
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Saves a refresh token using the provided data transfer object.
   *
   * @param refreshTokenDto - The data transfer object containing the refresh token details.
   * @returns {Promise<SaveRefreshTokenResponse>} A promise that resolves with the saved refresh token response.
   */
  async saveRefreshToken(
    refreshTokenDto: SaveRefreshTokenRequest,
  ): Promise<SaveRefreshTokenResponse> {
    return this.jwtTokenRepository.saveRefreshToken(refreshTokenDto);
  }
  /**
   * Deletes a refresh token.
   *
   * @param refreshToken - The refresh token to delete.
   * @returns {Promise<void>} A promise that resolves when the refresh token is deleted.
   */
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    return this.jwtTokenRepository.deleteRefreshToken(refreshToken);
  }

  /**
   * Deletes all refresh tokens associated with the given user ID.
   *
   * @param userId - The user ID to delete refresh tokens for.
   * @returns {Promise<void>} A promise that resolves when the refresh tokens are deleted.
   */
  async deleteRefreshTokensByUserId(userId: string): Promise<void> {
    await this.jwtTokenRepository.deleteRefreshTokensByUserId(userId);
  }

  /**
   * Updates an existing refresh token with a new value.
   *
   * @param updateRefreshTokenDto - An object containing the old and new refresh tokens.
   * @returns {Promise<void>} A promise that resolves when the refresh token is successfully updated.
   */
  async updateRefreshToken(updateRefreshTokenDto: UpdateRefreshTokenRequest): Promise<void> {
    return this.jwtTokenRepository.updateRefreshToken(updateRefreshTokenDto);
  }

  /**
   * Generates a new refresh token using the provided payload.
   * @param payload - The payload to include in the refresh token.
   * @returns {Promise<string>} A promise that resolves with the generated refresh token.
   */
  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(REFRESH_TOKEN_EXPIRATION_TIME),
    });
  }
  /**
   * Generates a new access token using the provided payload.
   * @param payload - The payload to include in the access token.
   * @returns {Promise<string>} A promise that resolves with the generated access token.
   */
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: millisecondsToSeconds(ACCESS_TOKEN_EXPIRATION_TIME),
    });
  }

  /**
   * Generates a new access token and refresh token using the provided payload.
   *
   * @param payload - The payload to include in the tokens.
   * @returns {Promise<GenerateTokensResponse>} A promise that resolves with an object containing the generated access token and refresh token.
   */
  async generateTokens(payload: JwtPayload): Promise<GenerateTokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  /**
   * Verifies a refresh token.
   * @param token - The refresh token to verify.
   * @returns {Promise<JwtPayload>} A promise that resolves with the payload of the refresh token if it is valid.
   * @throws {TokenExpiredError} If the refresh token is expired.
   * @throws {JsonWebTokenError} If the refresh token is invalid.
   */
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verify(token);
  }

  /**
   * This method is called when the module is initialized.
   * It triggers the deletion of expired refresh tokens from the repository.
   * This ensures that any outdated tokens are removed from storage,
   * maintaining the security and integrity of the token management system.
   */
  async onModuleInit(): Promise<void> {
    await this.jwtTokenRepository.deleteExpiredRefreshTokens();
  }

  /**
   * Deletes all expired refresh tokens from the repository.
   * This is an interval-based method that runs periodically.
   * It ensures that any outdated tokens are removed from storage,
   * maintaining the security and integrity of the token management system.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  @Interval(REFRESH_TOKEN_REMOVAL_INTERVAL)
  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.jwtTokenRepository.deleteExpiredRefreshTokens();
  }
}
