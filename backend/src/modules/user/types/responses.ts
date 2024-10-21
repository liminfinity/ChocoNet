import { User } from '@prisma/client';

export type CreateUserResponse = Pick<User, 'id' | 'email'>;
