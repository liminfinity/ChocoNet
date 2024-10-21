import { Module } from '@nestjs/common';
import { VerificationCodeRepository } from './repositories';
import { VerificationCodeService } from './services';

@Module({
  providers: [VerificationCodeRepository, VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
