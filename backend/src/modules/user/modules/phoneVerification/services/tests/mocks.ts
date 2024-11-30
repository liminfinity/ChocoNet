import { BaseFindUserServiceResponse } from '@/modules/user/services/types';
import { faker } from '@faker-js/faker';

export const mockUserId = faker.string.uuid();

export const mockUser: BaseFindUserServiceResponse = {
  id: mockUserId,
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  nickname: faker.internet.username(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
};

export const mockVerificationCode = faker.string.numeric(6);
