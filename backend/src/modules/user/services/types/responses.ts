import { Avatar } from '@prisma/client';
import { UserDto } from '../../types';

type BaseFindUserServiceResponse =
  | (Omit<UserDto, 'avatars'> & {
      avatars: (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[] | null;
    })
  | null;

export type FindUserByIdServiceResponse = BaseFindUserServiceResponse;

export type FindUserByEmailServiceResponse = BaseFindUserServiceResponse;
