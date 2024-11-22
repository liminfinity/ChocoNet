import { PastryMedia } from '@prisma/client';

type FindUserAvatarByIdResponse = Pick<PastryMedia, 'id' | 'filename'>;

export type FindUserAvatarByIdsResponse = FindUserAvatarByIdResponse[];

export type FindUserAvatarByUserIdResponse = FindUserAvatarByIdResponse[];
