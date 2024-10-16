import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '@/common/modules';
import { JwtStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { AuthRepository } from './repositories';
import { ENV } from './constants';

@Module({
  imports: [
    HashModule,
    PassportModule,
    JwtModule.register({
      secret: ENV.JWT_SECRET,
    }),
  ],
  providers: [AuthRepository, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
