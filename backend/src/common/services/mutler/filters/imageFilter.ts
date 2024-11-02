import { BadRequestException } from '@nestjs/common';
import type { MulterModuleOptions } from '@nestjs/platform-express';

export const imageFilter: MulterModuleOptions['fileFilter'] = (_req, file, cb) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
    return cb(null, true);
  } else {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
};
