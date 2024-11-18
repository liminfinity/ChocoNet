import { Avatar } from '@prisma/client';
import { UserRepositoryResponse } from '../../repositories/types';

export type AvatarServiceResponse = Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>;

export type BaseFindUserServiceResponse =
  | (Omit<UserRepositoryResponse, 'avatars'> & {
      avatars: AvatarServiceResponse[];
    })
  | null;

export type FindUserByIdServiceResponse = BaseFindUserServiceResponse;

export type FindUserByEmailServiceResponse = BaseFindUserServiceResponse;
