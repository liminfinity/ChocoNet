import { Module } from '@nestjs/common';
import { PasswordResetService } from './services';
import { PasswordResetController } from './controllers';
import { VerificationCodeModule } from '../verificationCode';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '@/common/configs';
import { JwtTokenModule } from '../jwtToken';
import { UserModule } from '@/modules/user';

@Module({
  imports: [UserModule, VerificationCodeModule, JwtTokenModule, MailerModule.forRoot(mailerConfig)],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
