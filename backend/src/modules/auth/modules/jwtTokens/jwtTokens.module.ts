import { Module } from '@nestjs/common';
import { JwtTokensRepository } from './repositories';
import { JwtTokensService } from './services';
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
  providers: [JwtTokensRepository, JwtTokensService],
  exports: [JwtTokensService],
})
export class JwtTokensModule {}
