import type { User } from '@prisma/client';

export type LoginControllerResponse = Omit<User, 'password'>;
