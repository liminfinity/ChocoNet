import omit from 'lodash.omit';
import { AvatarServiceResponse } from '../../../services/types';
import { GetFollowItemResponse, GetUserFollowItemResponse } from '../repositories/types';
import { getLinkToAvatar } from '@/modules/user/lib';

/**
 * Adds a path to the avatar object in a list of follow responses.
 *
 * @param follows - An array of follow item responses, each containing user information.
 * @returns A new array of follow item responses with the avatar path added to each user's avatar.
 *          If the user does not have an avatar, the avatar field will be null.
 */
export const addAvatarPathToFollows = (
  follows: GetFollowItemResponse[],
): (Omit<GetFollowItemResponse, 'user'> & {
  user: Omit<GetUserFollowItemResponse, 'avatar'> & { avatar: AvatarServiceResponse | null };
})[] => {
  return follows.map(({ user, ...follow }) => ({
    ...follow,
    user: {
      ...user,
      avatar: user.avatar && {
        ...omit(user.avatar, ['filename']),
        path: getLinkToAvatar(user.avatar.filename),
      },
    },
  }));
};
