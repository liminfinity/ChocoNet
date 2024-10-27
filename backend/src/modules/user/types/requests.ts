import { NonNullableKeys } from '@/common/types';
import { UserDto } from './dto';
import { Avatar } from '@prisma/client';

export type CreateUserRequest = NonNullableKeys<
  Omit<UserDto, 'id' | 'createdAt' | 'avatars'>,
  'geolocation'
> & {
  avatars: Pick<Avatar, 'filename'>[]
};
