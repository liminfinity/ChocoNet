import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type { SaveRefreshTokenResponse, SaveRefreshTokenRequest } from '../types';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async save(refreshTokenDto: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    return this.databaseService.refreshToken.create({
      data: refreshTokenDto,
      select: {
        id: true,
      },
    });
  }
}
