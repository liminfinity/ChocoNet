import type { MulterModuleOptions } from '@nestjs/platform-express';

const FILE_SIZE = 1024 * 1024 * 5; // 5 MB
const FILE_COUNT = 5;

export const FILE_LIMITS: MulterModuleOptions['limits'] = {
  fileSize: FILE_SIZE,
  files: FILE_COUNT,
} as const;
