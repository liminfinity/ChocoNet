import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '@/common/modules';
import { JwtStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { ENV } from './constants';
import { RefreshTokenModule } from '../refreshToken';
import { UserModule } from '../user';

@Module({
  imports: [
    HashModule,
    PassportModule,
    JwtModule.register({
      secret: ENV.JWT_SECRET,
    }),
    RefreshTokenModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
