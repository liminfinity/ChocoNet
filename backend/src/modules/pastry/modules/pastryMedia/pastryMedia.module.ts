import { Module } from '@nestjs/common';
import { PastryMediaService } from './services';
import { PastryMediaRepository } from './repositories';

@Module({
  providers: [PastryMediaRepository, PastryMediaService],
  exports: [PastryMediaService],
})
export class PastryMediaModule {}
