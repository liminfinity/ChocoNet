import { Module } from '@nestjs/common';
import { VerificationCodeRepository } from './repositories';
import { VerificationCodeService } from './services';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [VerificationCodeRepository, VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
