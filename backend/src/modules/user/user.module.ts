import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
