import { RefreshToken } from '@prisma/client';

export type SaveRefreshTokenRequest = Pick<RefreshToken, 'token' | 'userId'>;

export type UpdateRefreshTokenRequest = {
  oldToken: string;
  newToken: string;
};
