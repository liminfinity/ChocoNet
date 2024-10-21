import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/common/modules';
import { AuthModule } from './modules/auth';
import { ServeStaticModule } from '@nestjs/serve-static';
import { serveStaticConfig } from './common/configs';

@Module({
  imports: [DatabaseModule, ServeStaticModule.forRoot(serveStaticConfig), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
