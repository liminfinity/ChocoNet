import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { resolve } from 'node:path';
import { joinPaths } from '../lib';
import { ROUTER_PATHS } from '../constants';

const baseServeStaticConfig: ServeStaticModuleOptions = {
  exclude: [ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.API, '*')],
};

export const uploadServeStaticConfig: ServeStaticModuleOptions = {
  ...baseServeStaticConfig,
  rootPath: resolve(ROUTER_PATHS.UPLOADS),
  serveRoot: ROUTER_PATHS.HOME + ROUTER_PATHS.UPLOADS,
};

export const publicServeStaticConfig: ServeStaticModuleOptions = {
  ...baseServeStaticConfig,
  rootPath: resolve(ROUTER_PATHS.PUBLIC),
  serveRoot: ROUTER_PATHS.HOME + ROUTER_PATHS.PUBLIC,
};

export const mediaServeStaticConfig: ServeStaticModuleOptions = {
  ...baseServeStaticConfig,
  rootPath: resolve(ROUTER_PATHS.MEDIA),
  serveRoot: ROUTER_PATHS.HOME + ROUTER_PATHS.MEDIA,
};
