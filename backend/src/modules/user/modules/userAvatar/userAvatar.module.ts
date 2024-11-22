import { Module } from '@nestjs/common';
import { UserAvatarService } from './services';
import { UserAvatarRepository } from './repositories';

@Module({
  providers: [UserAvatarRepository, UserAvatarService],
  exports: [UserAvatarService],
})
export class UserAvatarModule {}
