import type { User } from '@prisma/client';

export type LoginReposityResponse = Pick<User, 'id' | 'email' | 'password'>;
