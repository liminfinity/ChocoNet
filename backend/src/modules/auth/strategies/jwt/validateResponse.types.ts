import { User } from '@prisma/client';

export type ValidateResponse = {
  userId: string;
} & Pick<User, 'email'>;
