type PickPathFromFile = Pick<Express.Multer.File, 'filename'>;

export const mapFilesToFilenames = (files: Express.Multer.File[]): PickPathFromFile[] => {
  return files.map(({ filename }) => ({ filename }));
};
