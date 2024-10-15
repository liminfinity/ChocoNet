import type { User } from '@prisma/client';

export type LoginServiceResponse = Pick<User, 'id' | 'email' | 'password'> & {
  accessToken: string;
  refreshToken: string;
};
