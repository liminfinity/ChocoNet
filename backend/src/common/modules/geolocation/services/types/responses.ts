import { AddressComponents } from './api';

export type GetBasicGeolocationResponse = Pick<AddressComponents, 'city' | 'city_district'> & {
  formatted: string;
};

export type GetDetailedGeolocationResponse = GetBasicGeolocationResponse &
  Pick<AddressComponents, 'state' | 'road'>;

export type GetGeolocationResponse<Level extends 'basic' | 'detailed'> = Level extends 'basic'
  ? GetBasicGeolocationResponse
  : GetDetailedGeolocationResponse;
