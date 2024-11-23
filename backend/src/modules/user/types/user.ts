import { Avatar, Geolocation, User } from '@prisma/client';

export type UserWithRelations = User & {
  avatars: (Pick<Avatar, 'id'> & Pick<Express.Multer.File, 'path'>)[] | null;
  geolocation: Geolocation | null;
};
