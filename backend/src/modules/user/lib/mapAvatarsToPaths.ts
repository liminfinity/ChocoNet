import { Avatar } from '@prisma/client';
import { getLinkToAvatar } from './getLinkToAvatar';
import { AvatarRepositoryResponse } from '../repositories/types';

/**
 * Maps an array of avatar responses to an array of objects
 * containing the avatar id and the link to the avatar.
 *
 * @param avatars - The array of avatar responses to map.
 * @returns An array of objects containing the avatar id and the link.
 */
export const mapAvatarsToPaths = (
  avatars: (AvatarRepositoryResponse & Pick<Avatar, 'id'>)[],
): (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[] => {
  return avatars.map(({ filename, ...avatar }) => ({
    ...avatar,
    path: getLinkToAvatar(filename),
  }));
};
