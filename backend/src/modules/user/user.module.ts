import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { GeolocationModule, HashModule, RedisModule } from '@/common/modules';
import { AuthMiddleware } from '../auth';
import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS } from './constants';
import { PastryLikeModule, PastryMediaModule } from '../pastry/modules';
import { PhoneVerificationModule, UserAvatarModule, UserFollowModule } from './modules';
import { JwtTokenModule } from '../auth/modules';
import { UserController } from './controllers';
import { PastryModule } from '../pastry';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '../pastry/constants';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';

@Module({
  imports: [
    HashModule,
    PastryLikeModule,
    JwtTokenModule,
    UserFollowModule,
    GeolocationModule,
    UserAvatarModule,
    PhoneVerificationModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    forwardRef(() => PastryMediaModule),
    forwardRef(() => PastryModule),
    JwtTokenModule,
    RedisModule,
  ],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: joinPaths(ROUTER_PATHS.USERS, ROUTER_PATHS.USER),
        method: RequestMethod.GET,
      },
      {
        path: joinPaths(ROUTER_PATHS.USERS, ROUTER_PATHS.USER, PASTRY_ROUTER_PATHS.PASTRIES),
        method: RequestMethod.GET,
      },
    );
  }
}
