import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { GeolocationModule, HashModule } from '@/common/modules';
import { AuthMiddleware } from '../auth';
import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS } from './constants';
import { PastryLikeModule } from '../pastry/modules';
import { UserFollowModule } from './modules';
import { JwtTokenModule } from '../auth/modules';
import { UserController } from './controllers';

@Module({
  imports: [HashModule, PastryLikeModule, JwtTokenModule, UserFollowModule, GeolocationModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: joinPaths(ROUTER_PATHS.USERS, ROUTER_PATHS.USER),
      method: RequestMethod.GET,
    });
  }
}
