import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../services';
import { RequestWithUser } from '@/modules/auth';
import { SetOptional } from 'type-fest';

@Injectable()
export class UserIdentityGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<SetOptional<RequestWithUser, 'user'>>();

    if (!user) {
      return false;
    }

    const { id: currentUserId } = user;

    const { id: userId } = params;

    const existingUser = await this.userService.findById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUserId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this user');
    }

    return true;
  }
}
