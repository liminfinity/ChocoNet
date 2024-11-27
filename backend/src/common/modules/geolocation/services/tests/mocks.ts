import { faker } from '@faker-js/faker';
import { OpenCageApiResponse } from '../types';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

export const mockSuccessApiResponse: OpenCageApiResponse = {
  status: { code: 200, message: 'OK' },
  total_results: 1,
  results: [
    {
      components: {
        city: faker.location.city(),
        city_district: faker.location.city(),
        road: faker.location.street(),
        state: faker.location.state(),
        country: faker.location.country(),
        formatted: faker.location.streetAddress(),
        postcode: faker.location.zipCode(),
      },
      annotations: {
        DMS: {
          lat: faker.location.latitude().toString(),
          lng: faker.location.longitude().toString(),
        },
      },
      geometry: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
      formatted: faker.location.streetAddress(),
    },
  ],
};

export const mockErrorApiResponse: OpenCageApiResponse = {
  status: { code: 400, message: 'Bad Request' },
  results: [],
  total_results: 0,
};

export const mockAxiosSuccessResponse: AxiosResponse<OpenCageApiResponse> = {
  data: mockSuccessApiResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { headers: {} as AxiosRequestHeaders },
};

export const mockAxiosErrorResponse: AxiosResponse<OpenCageApiResponse> = {
  data: mockErrorApiResponse,
  status: 400,
  statusText: 'Bad Request',
  headers: {},
  config: { headers: {} as AxiosRequestHeaders },
};
