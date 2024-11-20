import { NonNullableKeys } from '@/common/types';
import { Pastry, PastryCategory, PastryCategoryEnum, PastryMedia } from '@prisma/client';
import { CreatePastryDto, UpdatePastryDto } from '../../dto';
import { SetRequired } from 'type-fest';

export type CreatePastryRepositoryRequest = NonNullableKeys<
  Omit<CreatePastryDto, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'categories'>,
  'geolocation'
> & {
  media: Pick<PastryMedia, 'filename'>[];
  categories: Pick<PastryCategory, 'category'>[];
};

export type UpdatePastryRepositoryRequest = SetRequired<
  Partial<
    NonNullableKeys<
      Omit<UpdatePastryDto, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'categories'>,
      'geolocation'
    > & {
      media: Pick<PastryMedia, 'filename'>[];
      categories: Pick<PastryCategory, 'category'>[];
    }
  >,
  'mediaToRemove'
>;

export type PastryForGettingSimilar = Pick<Pastry, 'name' | 'id'> & { categories: PastryCategoryEnum[] };
