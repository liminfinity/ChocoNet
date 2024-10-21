import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { resolve } from 'node:path';
import { joinPaths } from '../lib';
import { ROUTER_PATHS } from '../constants';

export const serveStaticConfig: ServeStaticModuleOptions = {
  rootPath: resolve(ROUTER_PATHS.UPLOADS),
  serveRoot: ROUTER_PATHS.HOME + ROUTER_PATHS.UPLOADS,
  exclude: [ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.UPLOADS, '*')],
};
