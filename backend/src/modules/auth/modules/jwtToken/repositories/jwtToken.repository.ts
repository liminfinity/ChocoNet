import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type {
  SaveRefreshTokenResponse,
  SaveRefreshTokenRequest,
  UpdateRefreshTokenRequest,
} from '../types';

@Injectable()
export class JwtTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

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

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.databaseService.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
  }

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
}
