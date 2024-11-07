import { imageFilter } from '@/common/services/mutler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MEDIA_FILE_LIMITS } from '../constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaInterceptor extends FilesInterceptor('media', undefined, {
  fileFilter: imageFilter,
  limits: MEDIA_FILE_LIMITS,
}) {}
