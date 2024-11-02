import { NonNullableKeys } from '@/common/types';
import { Avatar } from '@prisma/client';
import { UserRepositoryResponse } from '../repositories/types';

export type CreateUserRequest = NonNullableKeys<
  Omit<UserRepositoryResponse, 'id' | 'createdAt' | 'avatars'>,
  'geolocation'
> & {
  avatars: Pick<Avatar, 'filename'>[];
};
