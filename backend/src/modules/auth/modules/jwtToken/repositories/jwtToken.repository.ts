import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type {
  SaveRefreshTokenResponse,
  SaveRefreshTokenRequest,
  UpdateRefreshTokenRequest,
} from '../types';
import { REFRESH_TOKEN_EXPIRATION_TIME } from '../constants';

@Injectable()
export class JwtTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Saves a refresh token.
   * @param refreshTokenDto The refresh token data.
   * @returns The saved refresh token ID.
   */
  async saveRefreshToken(
    refreshTokenDto: SaveRefreshTokenRequest,
  ): Promise<SaveRefreshTokenResponse> {
    return this.databaseService.refreshToken.create({
      data: refreshTokenDto,
      select: {
        id: true,
      },
    });
  }

  /**
   * Deletes a refresh token from the database.
   *
   * @param refreshToken - The refresh token to be deleted.
   * @returns A promise that resolves once the refresh token is deleted.
   */
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.databaseService.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
  }

  /**
   * Deletes all refresh tokens associated with the given user ID.
   *
   * @param userId - The user ID to delete refresh tokens for.
   * @returns A promise that resolves once all refresh tokens are deleted.
   */
  async deleteRefreshTokensByUserId(userId: string): Promise<void> {
    await this.databaseService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Updates an existing refresh token with a new value.
   *
   * @param param0 - An object containing the old token and the new token.
   * @returns A promise that resolves once the refresh token is updated.
   */
  async updateRefreshToken({ oldToken, newToken }: UpdateRefreshTokenRequest): Promise<void> {
    await this.databaseService.refreshToken.update({
      where: {
        token: oldToken,
      },
      data: {
        token: newToken,
      },
      select: {
        id: true,
      },
    });
  }

  /**
   * Deletes all expired refresh tokens from the database.
   *
   * @returns A promise that resolves once all expired refresh tokens are deleted.
   */
  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.databaseService.refreshToken.deleteMany({
      where: {
        updatedAt: {
          lte: new Date(Date.now() - REFRESH_TOKEN_EXPIRATION_TIME),
        },
      },
    });
  }
}
