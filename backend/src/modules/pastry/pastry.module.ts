import { Module } from '@nestjs/common';
import { PastryController } from './controllers';
import { PastryRepository } from './repositories';
import { PastryService } from './services';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [PastryRepository, PastryService],
  controllers: [PastryController],
})
export class PastryModule {}
