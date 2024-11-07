import { Avatar, User } from '@prisma/client';
import { GeolocationDto } from '../../dto';

export type AvatarRepositoryResponse = Pick<Avatar, 'filename' | 'id'>;

export type UserRepositoryResponse = User & {
  geolocation: GeolocationDto | null;
  avatars: AvatarRepositoryResponse[];
};

export type BaseFindUserRepositoryResponse = UserRepositoryResponse | null;

export type FindUserByIdRepositoryResponse = BaseFindUserRepositoryResponse;

export type FindUserByEmailRepositoryResponse = BaseFindUserRepositoryResponse;
