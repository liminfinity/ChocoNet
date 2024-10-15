import type { User } from '@prisma/client';

export type LoginControllerResponse = Pick<User, 'id' | 'email' | 'password'>;
