import { forwardRef, Module } from '@nestjs/common';
import { VerificationCodeRepository } from './repositories';
import { VerificationCodeService } from './services';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '@/modules/user';

@Module({
  imports: [ScheduleModule.forRoot(), forwardRef(() => UserModule)],
  providers: [VerificationCodeRepository, VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
