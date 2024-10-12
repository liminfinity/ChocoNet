import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/modules';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
