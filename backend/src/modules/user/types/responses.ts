import { User } from '@prisma/client';

export type CreateUserResponse = Pick<User, 'id' | 'email'>;

type BaseFindUserResponse = Omit<User, 'updatedAt'> | null;

export type FindUserByIdResponse = BaseFindUserResponse;

export type FindUserByEmailResponse = BaseFindUserResponse;
