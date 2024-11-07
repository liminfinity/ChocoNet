import { PastryMedia } from '@prisma/client';
import { PastryMediaRepositoryResponse } from '../repositories/types';
import { getLinkToPastryMedia } from './getLinkToPastryMedia';

/**
 * Maps an array of pastry media responses to an array of objects
 * containing the media id and the link to the media.
 *
 * @param media - The array of pastry media responses to map.
 * @returns An array of objects containing the media id and the link.
 */
export const mapPastryMediaToPaths = (
  media: (PastryMediaRepositoryResponse & Pick<PastryMedia, 'id'>)[],
): (Pick<Express.Multer.File, 'path'> & Pick<PastryMedia, 'id'>)[] => {
  return media.map(({ filename, ...avatar }) => ({
    ...avatar,
    path: getLinkToPastryMedia(filename),
  }));
};
