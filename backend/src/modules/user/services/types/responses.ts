import { Avatar } from '@prisma/client';
import { UserRepositoryResponse } from '../../repositories/types';

type BaseFindUserServiceResponse =
  | (Omit<UserRepositoryResponse, 'avatars'> & {
      avatars: (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[];
    })
  | null;

export type FindUserByIdServiceResponse = BaseFindUserServiceResponse;

export type FindUserByEmailServiceResponse = BaseFindUserServiceResponse;
