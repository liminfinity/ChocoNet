import { Geolocation, User } from '@prisma/client';

export type CreateUserRequest = Pick<
  User,
  'email' | 'password' | 'firstName' | 'lastName' | 'phone' | 'about'
> & {
  geolocation: Pick<Geolocation, 'lat' | 'lng'>;
} & {
  avatars: Pick<Express.Multer.File, 'filename'>[];
};
