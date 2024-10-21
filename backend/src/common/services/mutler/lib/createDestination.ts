import { DiskStorageOptions } from 'multer';
import { resolve } from 'node:path';
import { mkdir, access } from 'node:fs/promises';
import { ROUTER_PATHS } from '@/common/constants';

export const createDestination: DiskStorageOptions['destination'] = async (_req, file, cb) => {
  const destination = resolve(ROUTER_PATHS.UPLOADS, file.fieldname);
  try {
    await access(destination);
  } catch {
    await mkdir(destination, { recursive: true });
  } finally {
    cb(null, destination);
  }
};
