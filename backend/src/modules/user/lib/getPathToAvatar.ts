import { ROUTER_PATHS } from '@/common/constants';
import { resolve } from 'node:path';


/**
 * Given a filename, returns the path to the avatar.
 * The path is the concatenation of the home path, the uploads path, the avatars path, and the filename.
 * @param filename - The filename of the avatar.
 * @returns The path to the avatar.
 */
export const getPathToAvatar = (filename: string): string => {
  return resolve(ROUTER_PATHS.UPLOADS, ROUTER_PATHS.AVATARS, filename);
};
