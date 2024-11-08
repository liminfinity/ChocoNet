import { ROUTER_PATHS } from '@/common/constants';
import { resolve } from 'node:path';

/**
 * Given a filename, returns the path to the pastry media.
 * The path is the concatenation of the home path, the uploads path, the media path, and the filename.
 * @param filename - The filename of the media.
 * @returns The path to the pastry media.
 */
export const getPathToPastryMedia = (filename: string): string => {
  return resolve(ROUTER_PATHS.UPLOADS, ROUTER_PATHS.MEDIA, filename);
};
