import { Avatar, User, Geolocation } from '@prisma/client';

export type GeolocationDto = Pick<Geolocation, 'lat' | 'lng'>;

export type AvatarDto = Pick<Avatar, 'filename' | 'id'>;

export type UserDto = Omit<User, 'updatedAt'> & {
  geolocation: GeolocationDto | null;
  avatars: AvatarDto[] | null;
};
