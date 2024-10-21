import { MulterModuleOptions } from '@nestjs/platform-express';

const AVATAR_FILE_COUNT = 3;
const AVATAR_FILE_SIZE = 1024 * 1024 * 5; // 5 MB

export const AVATAR_FILE_LIMITS: MulterModuleOptions['limits'] = {
  fileSize: AVATAR_FILE_SIZE,
  files: AVATAR_FILE_COUNT,
} as const;
