import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '@/common/modules';
import { JwtStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { JwtTokensModule } from './modules';
import { UserModule } from '../user';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';

@Module({
  imports: [
    HashModule,
    PassportModule,
    JwtTokensModule,
    UserModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
