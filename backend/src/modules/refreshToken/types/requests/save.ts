import { RefreshToken } from '@prisma/client';

export type SaveRefreshTokenRequest = Pick<RefreshToken, 'token' | 'userId'>;
