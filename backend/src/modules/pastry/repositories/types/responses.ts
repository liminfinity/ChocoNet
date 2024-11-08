import { Pastry, PastryCategory, PastryMedia, User } from '@prisma/client';
import { PastryGeolocationDto } from '../../dto/geolocation';
import { PastryContactDto } from '../../dto/contact';

export type PastryMediaRepositoryResponse = Pick<PastryMedia, 'filename' | 'id'>;

export type PastryCategoryRepositoryResponse = Pick<PastryCategory, 'category' | 'id'>;

export type PastryRepositoryResponse = Omit<Pastry, 'userId'> & {
  geolocation: PastryGeolocationDto | null;
  contact: PastryContactDto | null;
  media: PastryMediaRepositoryResponse[];
  categories: PastryCategoryRepositoryResponse[];
  user: Pick<User, 'id' | 'firstName' | 'lastName'>;
  _count: {
    likes: number;
  };
};

export type BaseFindPastryRepositoryResponse = PastryRepositoryResponse;

export type FindPastryByIdRepositoryResponse = BaseFindPastryRepositoryResponse;
