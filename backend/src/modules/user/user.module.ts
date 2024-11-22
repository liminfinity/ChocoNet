import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { GeolocationModule, HashModule } from '@/common/modules';
import { AuthMiddleware } from '../auth';
import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS } from './constants';
import { PastryLikeModule, PastryMediaModule } from '../pastry/modules';
import { UserAvatarModule, UserFollowModule } from './modules';
import { JwtTokenModule } from '../auth/modules';
import { UserController } from './controllers';
import { PastryModule } from '../pastry';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '../pastry/constants';

@Module({
  imports: [
    HashModule,
    PastryLikeModule,
    JwtTokenModule,
    UserFollowModule,
    GeolocationModule,
    UserAvatarModule,
    forwardRef(() => PastryMediaModule),
    forwardRef(() => PastryModule),
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
