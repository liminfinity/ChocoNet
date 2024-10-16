import { Injectable } from "@nestjs/common";
import { RefreshTokenRepository } from "../../refreshToken/repositories";
import { SaveRefreshTokenRequest, SaveRefreshTokenResponse } from "../../refreshToken/types";


@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async save(refreshTokenDto: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    return this.refreshTokenRepository.save(refreshTokenDto);
  }
  
}
