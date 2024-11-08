import { PastryMedia } from '@prisma/client';

type FindPastryMediaByIdResponse = Pick<PastryMedia, 'id' | 'filename'>;

export type FindPastryMediaByIdsResponse = FindPastryMediaByIdResponse[];

export type FindPastryMediaByPastryIdResponse = FindPastryMediaByIdResponse[];
