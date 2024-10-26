import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '@/common/modules';
import { JwtStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { JwtTokenModule, VerificationCodeModule } from './modules';
import { UserModule } from '../user';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '@/common/configs';

@Module({
  imports: [
    HashModule,
    PassportModule,
    JwtTokenModule,
    VerificationCodeModule,
    UserModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MailerModule.forRoot(mailerConfig),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
