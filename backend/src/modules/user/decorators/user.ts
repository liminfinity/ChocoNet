import { UserFromToken } from '@/modules/auth/strategies';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  <T extends keyof UserFromToken | undefined>(
    field: T,
    ctx: ExecutionContext,
  ): T extends keyof UserFromToken ? UserFromToken[T] : UserFromToken => {
    const { user } = ctx.switchToHttp().getRequest();

    return field ? user[field] : user;
  },
);
