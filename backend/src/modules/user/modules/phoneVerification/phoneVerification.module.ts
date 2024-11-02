import { Module } from '@nestjs/common';
import { VerificationCodeModule } from '@/modules/auth/modules';
import { SmsModule } from '@/common/modules';
import { PhoneVerificationService } from './services';
import { PhoneVerificationRepository } from './repositories';
import { PhoneVerificationController } from './controllers';
import { UserModule } from '@/modules/user';

@Module({
  imports: [UserModule, VerificationCodeModule, SmsModule],
  controllers: [PhoneVerificationController],
  providers: [PhoneVerificationService, PhoneVerificationRepository],
  exports: [PhoneVerificationService],
})
export class PhoneVerificationModule {}
