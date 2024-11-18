import { UserFollow } from '@prisma/client';

export type OrderBy = Extract<keyof UserFollow, 'createdAt'>;
