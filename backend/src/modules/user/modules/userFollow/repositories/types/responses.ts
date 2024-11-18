import { AvatarRepositoryResponse } from '@/modules/user/repositories/types';
import { User, UserFollow } from '@prisma/client';

export type GetUserFollowItemResponse = Pick<User, 'id' | 'firstName' | 'lastName' | 'nickname'> & {
  avatar: AvatarRepositoryResponse | null;
};

export type GetFollowItemResponse = Pick<UserFollow, 'createdAt' | 'id'> & {
  user: GetUserFollowItemResponse;
};

export type GetFollowsResponse = GetFollowItemResponse[];
