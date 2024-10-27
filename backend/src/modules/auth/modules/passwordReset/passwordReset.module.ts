import { Module } from '@nestjs/common';
import { PasswordResetService } from './services';
import { PasswordResetController } from './controllers';
import { UserModule } from '@/modules/user';
import { VerificationCodeModule } from '../verificationCode';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '@/common/configs';
import { JwtTokenModule } from '../jwtToken';

@Module({
  imports: [UserModule, VerificationCodeModule, JwtTokenModule, MailerModule.forRoot(mailerConfig)],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
