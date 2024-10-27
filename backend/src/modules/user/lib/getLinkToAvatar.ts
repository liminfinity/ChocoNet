import { ENV, ROUTER_PATHS } from '@/common/constants';
import { createOrigin, joinPaths } from '@/common/lib';

export const getLinkToAvatar = (filename: string): string => {
  const path = ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.UPLOADS, ROUTER_PATHS.AVATARS, filename);
  const origin = createOrigin(ENV.HOST, ENV.PORT);
  return `${origin}${path}`;
};
