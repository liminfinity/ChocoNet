import { DiskStorageOptions } from 'multer';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';

export const createFilename: DiskStorageOptions['filename'] = (_req, file, cb) => {
  const uniqueSuffix = randomUUID();
  const ext = extname(file.originalname);
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  return cb(null, filename);
};
