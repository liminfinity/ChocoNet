import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { HashModule } from '@/common/modules';

@Module({
  imports: [HashModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
