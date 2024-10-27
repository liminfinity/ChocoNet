import { Avatar, User } from '@prisma/client';
import { UserRepositoryResponse } from '../repositories/types';

export type CreateUserResponse = Pick<User, 'id' | 'email'>;

type BaseFindUserResponse =
  | (Omit<UserRepositoryResponse, 'avatars'> & {
      avatars: (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[];
    })
  | null;

export type FindUserByIdResponse = BaseFindUserResponse;

export type FindUserByEmailResponse = BaseFindUserResponse;
