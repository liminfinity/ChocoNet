import { faker } from '@faker-js/faker';
import {
  CreatePastryDto,
  GetPastryAutorizedDto,
  GetPastryGuestDto,
  GetPastryOwnerDto,
  GetPastryQueriesDto,
} from '../../dto';
import { PastryUnit } from '@prisma/client';
import {
  GetPastriesResponse,
  GetSimilarPastriesResponse,
  GetUserPastriesResponse,
  PastryRepositoryResponse,
} from '../../repositories/types';
import omit from 'lodash.omit';
import { FindPastryMediaByPastryIdResponse } from '../../modules/pastryMedia/types';
import { GeolocationService } from '@/common/modules';

export const mockCreatePastryDto: CreatePastryDto = {
  name: faker.commerce.product(),
  price: faker.number.int(),
  unit: PastryUnit.GRAM,
  contact: {
    phone: faker.phone.number(),
  },
  categories: [],
  media: [],
  description: faker.commerce.productDescription(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
};

export const mockGeolocation: Awaited<ReturnType<GeolocationService['getGeolocationByCoords']>> = {
  city_district: faker.location.city(),
  city: faker.location.city(),
  state: faker.location.state(),
  road: faker.location.street(),
  formatted: faker.location.streetAddress(),
};

export const mockUserId = faker.string.uuid();
export const mockPastryId = faker.string.uuid();

export const mockUpdatePastryDto = {};
export const mockPastry: PastryRepositoryResponse = {
  user: {
    createdAt: faker.date.recent(),
    id: mockUserId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    nickname: faker.internet.username(),
  },
  price: faker.number.int(),
  unit: PastryUnit.GRAM,
  createdAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  contact: {
    phone: faker.phone.number(),
  },
  categories: [],
  media: [],
  description: faker.commerce.productDescription(),
  name: faker.commerce.product(),
  _count: {
    likes: faker.number.int(),
  },
  updatedAt: faker.date.recent(),
};

export const mockOwnerPastry: GetPastryOwnerDto = {
  ...omit(mockPastry, ['user']),
  media: [],
  geolocation: mockPastry.geolocation && {
    ...mockPastry.geolocation,
    formatted: mockGeolocation.formatted,
  },
};

export const mockGuestPastry: GetPastryGuestDto = {
  ...omit(mockPastry, ['user', 'updatedAt']),
  owner: {
    ...mockPastry.user,
  },
  media: [],
  geolocation: mockPastry.geolocation && {
    ...mockPastry.geolocation,
    formatted: mockGeolocation.formatted,
  },
};

export const mockAuthorizedPastry: GetPastryAutorizedDto = {
  isLiked: faker.datatype.boolean(),
  ...mockGuestPastry,
};

export const mockPastryMedia: FindPastryMediaByPastryIdResponse = [
  {
    id: faker.string.uuid(),
    filename: faker.image.url(),
  },
];

export const mockGetPastries: GetPastriesResponse = [
  {
    id: faker.string.uuid(),
    price: faker.number.int(),
    unit: PastryUnit.GRAM,
    createdAt: faker.date.recent(),
    geolocation: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    media: [],
    name: faker.commerce.product(),
    _count: {
      likes: faker.number.int(),
    },
  },
];

export const mockQuery: GetPastryQueriesDto = {
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

export const mockGetSimilarPastries: GetSimilarPastriesResponse = [
  {
    id: faker.string.uuid(),
    price: faker.number.int(),
    unit: PastryUnit.GRAM,
    createdAt: faker.date.recent(),
    geolocation: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    media: [],
    name: faker.commerce.product(),
    _count: {
      likes: faker.number.int(),
    },
    categories: [],
  },
];

export const mockGetUserPastries: GetUserPastriesResponse = [
  {
    id: faker.string.uuid(),
    price: faker.number.int(),
    unit: PastryUnit.GRAM,
    createdAt: faker.date.recent(),
    geolocation: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    media: [],
    name: faker.commerce.product(),
    _count: {
      likes: faker.number.int(),
    },
  },
];
