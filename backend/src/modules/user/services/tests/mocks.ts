import { faker } from '@faker-js/faker';
import { mapAvatarsToPaths } from '@/modules/user/lib';
import { CreateUserRequest, CreateUserResponse } from '@/modules/user/types';
import { BaseFindUserServiceResponse } from '../types';
import { BaseFindUserRepositoryResponse } from '../../repositories/types';

export const mockRepositoryUser: NonNullable<BaseFindUserRepositoryResponse> = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  nickname: faker.internet.username(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
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

export const mockCreateUserRequest: CreateUserRequest = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  nickname: faker.internet.username(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
};

export const mockCreateUserResponse: CreateUserResponse = {
  email: mockCreateUserRequest.email,
  id: faker.string.uuid(),
};

export const mockNewPassword = faker.internet.password();

export const mockRepositoryUserWithNewPassword: NonNullable<BaseFindUserRepositoryResponse> = {
  ...mockRepositoryUser,
  password: mockNewPassword,
};

export const mockServiceUserWithNewPassword: NonNullable<BaseFindUserServiceResponse> = {
  ...mockServiceUser,
  password: mockNewPassword,
};
