import { Module } from '@nestjs/common';
import { JwtTokenRepository } from './repositories';
import { JwtTokenService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from '../../constants';

@Module({
  imports: [
    JwtModule.register({
      secret: ENV.JWT_SECRET,
      signOptions: {
        issuer: ENV.JWT_ISSUER,
      },
      verifyOptions: {
        issuer: ENV.JWT_ISSUER,
      },
    }),
  ],
  providers: [JwtTokenRepository, JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
