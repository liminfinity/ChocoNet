import { ENV, ROUTER_PATHS } from '@/common/constants';
import { createOrigin, joinPaths } from '@/common/lib';

/**
 * Given a filename, returns a link to the pastry media.
 * This link is the concatenation of the origin and the path.
 * The path is the concatenation of the home path, the uploads path, the pastry media path, and the filename.
 */
export const getLinkToPastryMedia = (filename: string): string => {
  const path = ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.UPLOADS, ROUTER_PATHS.MEDIA, filename);
  const origin = createOrigin(ENV.HOST, ENV.PORT, ENV.PROTOCOL);
  return `${origin}${path}`;
};
