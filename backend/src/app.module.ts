import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/common/modules';
import { AuthModule } from './modules/auth';
import { ServeStaticModule } from '@nestjs/serve-static';
import { uploadServeStaticConfig, publicServeStaticConfig } from './common/configs';
import { MorganMiddleware } from './common/middlewares';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot(uploadServeStaticConfig, publicServeStaticConfig),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
