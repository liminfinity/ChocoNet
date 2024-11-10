import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PastryController } from './controllers';
import { PastryRepository } from './repositories';
import { PastryService } from './services';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/common/services';
import { PastryLikeModule, PastryMediaModule } from './modules';
import { AuthMiddleware } from '../auth';
import { ROUTER_PATHS } from './constants';
import { GeolocationModule } from '@/common/modules';
import { JwtTokenModule } from '../auth/modules';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    PastryLikeModule,
    PastryMediaModule,
    GeolocationModule,
    JwtTokenModule,
  ],
  providers: [PastryRepository, PastryService],
  controllers: [PastryController],
})
export class PastryModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: ROUTER_PATHS.PASTRIES,
      method: RequestMethod.ALL,
    });
  }
}
