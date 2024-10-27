import { Avatar } from '@prisma/client';
import { AvatarDto } from '../types/dto';
import { getLinkToAvatar } from './getLinkToAvatar';

export const mapAvatarsToPaths = (
  avatars: (AvatarDto & Pick<Avatar, 'id'>)[] | null,
): (Pick<Express.Multer.File, 'path'> & Pick<Avatar, 'id'>)[] | null => {
  if (!avatars) {
    return null;
  }
  return avatars.map(({ filename, ...avatar }) => ({
    ...avatar,
    path: getLinkToAvatar(filename),
  }));
};
