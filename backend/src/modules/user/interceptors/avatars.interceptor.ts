import { imageFilter } from '@/common/services/mutler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AVATAR_FILE_LIMITS } from '../constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarsInterceptor extends FilesInterceptor('avatars', undefined, {
  fileFilter: imageFilter,
  limits: AVATAR_FILE_LIMITS,
}) {}
