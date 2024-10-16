import { Module } from '@nestjs/common';
import { RefreshTokenRepository } from './repositories';
import { RefreshTokenService } from './services';

@Module({
  providers: [RefreshTokenRepository, RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
