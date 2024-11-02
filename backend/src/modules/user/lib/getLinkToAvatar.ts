import { ENV, ROUTER_PATHS } from '@/common/constants';
import { createOrigin, joinPaths } from '@/common/lib';

/**
 * Given a filename, returns a link to the avatar.
 * This link is the concatenation of the origin and the path.
 * The path is the concatenation of the home path, the uploads path, the avatars path, and the filename.
 */
export const getLinkToAvatar = (filename: string): string => {
  const path = ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.UPLOADS, ROUTER_PATHS.AVATARS, filename);
  const origin = createOrigin(ENV.HOST, ENV.PORT);
  return `${origin}${path}`;
};
