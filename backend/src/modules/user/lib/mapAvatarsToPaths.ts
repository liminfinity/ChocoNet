import { Avatar } from '@prisma/client';
import { getLinkToAvatar } from './getLinkToAvatar';
import { AvatarRepositoryResponse } from '../repositories/types';

export const mapAvatarsToPaths = (
  avatars: (AvatarRepositoryResponse & Pick<Avatar, 'id'>)[],
): (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[] => {
  return avatars.map(({ filename, ...avatar }) => ({
    ...avatar,
    path: getLinkToAvatar(filename),
  }));
};
