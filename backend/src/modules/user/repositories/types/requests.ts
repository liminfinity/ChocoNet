import { NonNullableKeys } from '@/common/types';
import { SetRequired } from 'type-fest';
import { UpdateUserDto } from '../../dto';
import { Avatar } from '@prisma/client';

export type UpdateUserRepositoryRequest = SetRequired<
  Partial<
    NonNullableKeys<Omit<UpdateUserDto, 'avatars'>, 'geolocation'> & {
      avatars: Pick<Avatar, 'filename'>[];
    }
  >,
  'avatarsToRemove'
>;
