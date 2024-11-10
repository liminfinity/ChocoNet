import { RequestWithUser } from '@/modules/auth';
import { UserFromToken } from '@/modules/auth/strategies';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetOptional } from 'type-fest';

export const User = createParamDecorator(
  <T extends keyof UserFromToken>(
    field: T | undefined,
    ctx: ExecutionContext,
  ): (UserFromToken[T] | UserFromToken) | undefined => {
    const { user } = ctx.switchToHttp().getRequest<SetOptional<RequestWithUser, 'user'>>();

    return field && user ? user[field] : user;
  },
);
