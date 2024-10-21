import { Injectable } from '@nestjs/common';
import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createDestination, createFilename } from './lib';
import { FILE_LIMITS } from './multer.constants';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: createDestination,
        filename: createFilename,
      }),
      limits: FILE_LIMITS,
    };
  }
}
