import { MulterModuleOptions } from '@nestjs/platform-express';

const MEDIA_FILE_COUNT = 5;
const MEDIA_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

export const MEDIA_FILE_LIMITS: MulterModuleOptions['limits'] = {
  fileSize: MEDIA_FILE_SIZE,
  files: MEDIA_FILE_COUNT,
} as const;
