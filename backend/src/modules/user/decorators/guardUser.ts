import { RequestWithUser, UserFromToken } from '@/modules/auth';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GuardUser = createParamDecorator(
  <T extends keyof UserFromToken>(
    field: T | undefined,
    ctx: ExecutionContext,
  ): UserFromToken[T] | UserFromToken => {
    const { user } = ctx.switchToHttp().getRequest<RequestWithUser>();

    return field ? user[field] : user;
  },
);
