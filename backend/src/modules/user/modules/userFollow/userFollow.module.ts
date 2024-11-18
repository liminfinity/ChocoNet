import { Module } from '@nestjs/common';
import { UserFollowController } from './controllers';
import { UserFollowService } from './services';
import { UserFollowRepository } from './repositories';
import { UserModule } from '../../user.module';

@Module({
  imports: [UserModule],
  providers: [UserFollowRepository, UserFollowService],
  controllers: [UserFollowController],
  exports: [UserFollowService],
})
export class UserFollowModule {}
