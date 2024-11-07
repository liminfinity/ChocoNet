import { NonNullableKeys } from '@/common/types';
import { PastryCategory, PastryMedia } from '@prisma/client';
import { CreatePastryDto } from '../../dto';

export type CreatePastryRepositoryRequest = NonNullableKeys<
  Omit<CreatePastryDto, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'categories'>,
  'geolocation'
> & {
  media: Pick<PastryMedia, 'filename'>[];
  categories: Pick<PastryCategory, 'category'>[];
};
