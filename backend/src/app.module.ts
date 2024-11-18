import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/common/modules';
import { AuthModule } from './modules/auth';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  uploadServeStaticConfig,
  publicServeStaticConfig,
  mediaServeStaticConfig,
} from './common/configs';
import { MorganMiddleware } from './common/middlewares';
import { UserModule } from './modules/user';
import { PhoneVerificationModule, UserFollowModule } from './modules/user/modules';
import { PastryModule } from './modules/pastry';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot(
      uploadServeStaticConfig,
      mediaServeStaticConfig,
      publicServeStaticConfig,
    ),
    AuthModule,
    UserModule,
    PhoneVerificationModule,
    UserFollowModule,
    PastryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
