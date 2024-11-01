import { User } from '@prisma/client';

export type UserFromToken = Pick<User, 'email' | 'id'>;
