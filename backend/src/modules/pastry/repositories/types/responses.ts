import { Pastry, PastryCategoryEnum, PastryMedia, User } from '@prisma/client';
import { PastryGeolocationDto } from '../../dto/geolocation.dto';
import { PastryContactDto } from '../../dto/contact.dto';

export type PastryMediaRepositoryResponse = Pick<PastryMedia, 'filename' | 'id'>;

export type PastryRepositoryResponse = Omit<Pastry, 'userId' | 'id'> & {
  geolocation: PastryGeolocationDto | null;
  contact: PastryContactDto | null;
  media: PastryMediaRepositoryResponse[];
  categories: PastryCategoryEnum[];
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'nickname' | 'createdAt'>;
  _count: {
    likes: number;
  };
};

export type BaseFindPastryRepositoryResponse = PastryRepositoryResponse;

export type FindPastryByIdRepositoryResponse = BaseFindPastryRepositoryResponse;

export type GetPastryItemResponse = Omit<Pastry, 'userId' | 'updatedAt' | 'description'> & {
  media: PastryMediaRepositoryResponse[];
  geolocation: PastryGeolocationDto | null;
  _count: {
    likes: number;
  };
};

export type GetPastriesResponse = GetPastryItemResponse[];

export type GetUserPastriesResponse = GetPastryItemResponse[];

export type GetSimilarPastriesResponse = (GetPastryItemResponse & {
  categories: PastryCategoryEnum[];
})[];
