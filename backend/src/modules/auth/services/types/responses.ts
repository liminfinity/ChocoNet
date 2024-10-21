import type { User } from '@prisma/client';

type AuthServiceResponse = {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
};

export type LoginServiceResponse = AuthServiceResponse;

export type RefreshServiceResponse = AuthServiceResponse;
