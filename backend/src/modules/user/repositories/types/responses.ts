import { Avatar, PhoneVerification, User } from '@prisma/client';
import { GeolocationDto } from '../../dto';

export type AvatarRepositoryResponse = Pick<Avatar, 'filename' | 'id'>;

export type UserRepositoryResponse = User & {
  geolocation: GeolocationDto | null;
  avatars: AvatarRepositoryResponse[];
};

export type BaseFindUserRepositoryResponse = UserRepositoryResponse | null;

export type FindUserByIdRepositoryResponse = BaseFindUserRepositoryResponse;

export type FindUserByEmailRepositoryResponse = BaseFindUserRepositoryResponse;

export type FindByNicknameRepositoryResponse = BaseFindUserRepositoryResponse;

export type GetProfileRepositoryResponse = Omit<User, 'id' | 'password'> & {
  geolocation: GeolocationDto | null;
  avatars: AvatarRepositoryResponse[];
  phoneVerification: Pick<PhoneVerification, 'isVerified'> | null;
  _count: {
    followers: number;
    following: number;
    pastries: number;
  }
};
