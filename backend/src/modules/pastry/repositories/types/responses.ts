import { Pastry, PastryCategory, PastryMedia } from '@prisma/client';
import { PastryGeolocationDto } from '../../dto/geolocation';
import { PastryContactDto } from '../../dto/contact';

export type PastryMediaRepositoryResponse = Pick<PastryMedia, 'filename' | 'id'>;

export type PastryCategoryRepositoryResponse = Pick<PastryCategory, 'category' | 'id'>;

export type PastryRepositoryResponse =
  | (Pastry & {
      geolocation: PastryGeolocationDto | null;
      contact: PastryContactDto | null;
      media: PastryMediaRepositoryResponse[];
      categories: PastryCategoryRepositoryResponse[];
      _count: {
        likes: number;
      };
    })
  | null;

export type BaseFindPastryRepositoryResponse = PastryRepositoryResponse;

export type FindPastryByIdRepositoryResponse = BaseFindPastryRepositoryResponse;
