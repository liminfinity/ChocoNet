import { Avatar, User } from '@prisma/client';
import { UserDto } from './dto';

export type CreateUserResponse = Pick<User, 'id' | 'email'>;

type BaseFindUserResponse =
  | (Omit<UserDto, 'avatars'> & { avatars: (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[] })
  | null;

export type FindUserByIdResponse = BaseFindUserResponse;

export type FindUserByEmailResponse = BaseFindUserResponse;
