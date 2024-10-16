import type { User } from '@prisma/client';

export type LoginServiceResponse = {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
};
