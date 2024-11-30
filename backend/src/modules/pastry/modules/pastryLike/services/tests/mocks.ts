import { GeolocationService } from '@/common/modules';
import { GetPastriesResponse, PastryRepositoryResponse } from '@/modules/pastry/repositories/types';
import { faker } from '@faker-js/faker';
import { PastryUnit } from '@prisma/client';
import { GetLikedPastryQueriesDto } from '../../dto';

export const mockPastryId = faker.string.uuid();

export const mockUserId = faker.string.uuid();

export const mockRepositoryPastry: PastryRepositoryResponse = {
  name: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  contact: {
    phone: faker.phone.number(),
  },
  media: [],
  categories: [],
  user: {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    nickname: faker.internet.username(),
    createdAt: faker.date.recent(),
  },
  _count: {
    likes: faker.number.int(),
  },
  createdAt: faker.date.recent(),
  price: faker.number.int(),
  updatedAt: faker.date.recent(),
  unit: PastryUnit.GRAM,
};

export const mockRepositoryGetPastries: GetPastriesResponse = [
  {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    unit: PastryUnit.GRAM,
    price: faker.number.int(),
    createdAt: faker.date.recent(),
    _count: {
      likes: faker.number.int(),
    },
    geolocation: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    media: [],
  },
];

export const mockGeolocation: Awaited<ReturnType<GeolocationService['getGeolocationByCoords']>> = {
  city_district: faker.location.city(),
  city: faker.location.city(),
  state: faker.location.state(),
  road: faker.location.street(),
  formatted: faker.location.streetAddress(),
};

export const mockQuery: GetLikedPastryQueriesDto = {
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
