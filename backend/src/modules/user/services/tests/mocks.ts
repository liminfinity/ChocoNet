import { faker } from '@faker-js/faker';
import {
  BaseFindUserRepositoryResponse,
  GetProfileRepositoryResponse,
} from '../../repositories/types';
import { CreateUserRequest, CreateUserResponse } from '../../types';
import {
  GetGuestProfileDto,
  GetOtherProfileDto,
  GetSelfProfileDto,
  UpdateUserDto,
} from '../../dto';
import omit from 'lodash.omit';
import { mapAvatarsToPaths } from '../../lib';
import { GetUserPastriesDto, GetUserPastryQueriesDto } from '@/modules/pastry/dto';
import { PastryUnit } from '@prisma/client';
import { FindUserAvatarByUserIdResponse } from '../../modules/userAvatar/types';
import { FindPastryMediaByPastryIdResponse } from '@/modules/pastry/modules/pastryMedia/types';
import { VerifyAndUpdatePasswordServiceRequest } from '../types';

export const mockUserId = faker.string.uuid();

export const mockUser: NonNullable<BaseFindUserRepositoryResponse> = {
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

export const mockCreateUserRequest: CreateUserRequest = {
  about: faker.person.bio(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  nickname: faker.internet.username(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
};

export const mockCreateUserResponse: NonNullable<CreateUserResponse> = {
  email: faker.internet.email(),
  id: faker.string.uuid(),
};

export const mockHashedPassword = faker.string.uuid();

export const mockProfile: GetProfileRepositoryResponse = {
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  nickname: faker.internet.username(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
  _count: {
    followers: faker.number.int(),
    following: faker.number.int(),
    pastries: faker.number.int(),
  },
  phoneVerification: {
    isVerified: faker.datatype.boolean(),
  },
};

export const mockGuestProfile: GetGuestProfileDto = {
  ...omit(mockProfile, ['geolocation', 'phoneVerification', 'email', 'phone', 'updatedAt']),
  _count: {
    ...mockProfile._count,
    likes: faker.number.int(),
  },
  avatars: mapAvatarsToPaths(mockProfile.avatars),
};

export const mockSelfProfile: GetSelfProfileDto = {
  ...mockGuestProfile,
  contact: {
    email: mockProfile.email,
    phone: mockProfile.phone,
    phoneVerified: mockProfile.phoneVerification?.isVerified ?? false,
  },
  geolocation: mockProfile.geolocation && {
    ...mockProfile.geolocation,
    formatted: faker.location.streetAddress(),
  },
  updatedAt: mockProfile.updatedAt,
};

export const mockOtherProfile: GetOtherProfileDto = {
  ...mockGuestProfile,
  contact: {
    email: mockProfile.email,
    phone: mockProfile.phone,
    phoneVerified: mockProfile.phoneVerification?.isVerified ?? false,
  },
  geolocation: mockProfile.geolocation && {
    ...mockProfile.geolocation,
    formatted: faker.location.streetAddress(),
  },
  isFollowing: faker.datatype.boolean(),
};

export const mockPastryId = faker.string.uuid();

export const mockGetUserPastries: GetUserPastriesDto = {
  data: [
    {
      id: mockPastryId,
      price: faker.number.int(),
      unit: PastryUnit.GRAM,
      createdAt: faker.date.recent(),
      geolocation: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        formatted: faker.location.streetAddress(),
      },
      media: [],
      name: faker.commerce.product(),
      _count: {
        likes: faker.number.int(),
      },
    },
  ],
  nextCursor: mockPastryId,
};

export const mockQuery: GetUserPastryQueriesDto = {
  orderBy: 'createdAt',
  order: 'desc',
  search: '',
  categories: [],
  price: {
    min: 0,
    max: 100,
  },
  pagination: {
    cursor: '',
    limit: 10,
  },
  geolocation: {
    lat: 0,
    lng: 0,
    radius: 0,
  },
};

export const mockAvatarsToRemove: FindUserAvatarByUserIdResponse = [];

export const mockPastryIds = [];

export const mockPastryMediaToRemove: FindPastryMediaByPastryIdResponse = mockPastryIds.map(
  (pastryId) => ({
    id: pastryId,
    filename: faker.image.url(),
  }),
);

export const mockUpdatePassword: VerifyAndUpdatePasswordServiceRequest = {
  oldPassword: faker.internet.password(),
  newPassword: faker.internet.password(),
  logoutFromOtherDevices: faker.datatype.boolean(),
};

export const mockUpdateUserDto: UpdateUserDto = {
  about: faker.person.bio(),
  phone: faker.phone.number(),
  nickname: faker.internet.username(),
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  geolocation: {
    lng: faker.location.longitude(),
    lat: faker.location.latitude(),
  },
  avatars: [],
  avatarsToRemove: [],
};
