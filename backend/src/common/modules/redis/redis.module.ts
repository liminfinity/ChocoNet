import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { ENV, TTL } from './redis.constants';

@Module({
  imports: [
    CacheModule.register({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: ENV.REDIS_HOST,
            port: ENV.REDIS_PORT,
          },
        }),
        ttl: TTL,
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
