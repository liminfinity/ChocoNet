import { Module } from '@nestjs/common';
import { PastryController } from './controllers';
import { PastryRepository } from './repositories';
import { PastryService } from './services';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';
import { PastryLikeModule } from './modules';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    PastryLikeModule,
  ],
  providers: [PastryRepository, PastryService],
  controllers: [PastryController],
})
export class PastryModule {}
