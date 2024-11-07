import { Module } from '@nestjs/common';
import { PastryLikeController } from './controllers';
import { PastryLikeService } from './services';
import { PastryLikeRepository } from './repositories';
import { PastryRepository } from '../../repositories';

@Module({
  providers: [PastryLikeRepository, PastryLikeService, PastryRepository],
  controllers: [PastryLikeController],
  exports: [PastryLikeService],
})
export class PastryLikeModule {}
