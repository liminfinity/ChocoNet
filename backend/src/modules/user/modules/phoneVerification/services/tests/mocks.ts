import { faker } from '@faker-js/faker';
import { BaseFindUserServiceResponse } from '@/modules/user/services/types';
import { BaseFindUserRepositoryResponse } from '@/modules/user/repositories/types';
import { mapAvatarsToPaths } from '@/modules/user/lib';

export const mockRepositoryUser: NonNullable<BaseFindUserRepositoryResponse> = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [
    {
      id: faker.string.uuid(),
      filename: faker.image.url(),
    },
  ],
};

export const mockServiceUser: NonNullable<BaseFindUserServiceResponse> = {
  ...mockRepositoryUser,
  avatars: mapAvatarsToPaths(mockRepositoryUser.avatars),
};
