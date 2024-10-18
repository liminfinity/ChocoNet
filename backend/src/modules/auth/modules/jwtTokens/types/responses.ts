import { RefreshToken } from '@prisma/client';

export type SaveRefreshTokenResponse = Pick<RefreshToken, 'id'>;
