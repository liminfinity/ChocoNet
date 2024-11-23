type PickFilenameFromFile = Pick<Express.Multer.File, 'filename'>;

/**
 * Maps an array of Multer files to an array of objects containing only the filename.
 *
 * @param files - The array of Multer files to map.
 * @returns An array of objects containing the filename.
 */
export const mapFilesToFilenames = (files: Express.Multer.File[]): PickFilenameFromFile[] => {
  return files.map(({ filename }) => ({ filename }));
};
