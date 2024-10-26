import type { User } from '@prisma/client';

type AuthServiceResponse = {
  user: Omit<User, 'password' | 'updatedAt' | 'id'>;
  accessToken: string;
  refreshToken: string;
};

export type LoginServiceResponse = AuthServiceResponse;

export type RefreshServiceResponse = AuthServiceResponse;

export type VerifyCodeServiceResponse = AuthServiceResponse;
