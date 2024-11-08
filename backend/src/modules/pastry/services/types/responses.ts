import { PastryMedia } from '@prisma/client';
import { PastryRepositoryResponse } from '../../repositories/types';

export type BaseFindPastryServiceResponse = Omit<PastryRepositoryResponse, 'media'> & {
  media: (Pick<Express.Multer.File, 'path'> & Pick<PastryMedia, 'id'>)[];
};

export type FindPastryByIdServiceResponse = BaseFindPastryServiceResponse;

export type OwnerFindPastryByIdServiceResponse = Omit<FindPastryByIdServiceResponse, 'user'>;

export type PublicFindPastryByIdServiceResponse = FindPastryByIdServiceResponse & {
  isLiked: boolean;
};
