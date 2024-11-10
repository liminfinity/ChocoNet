import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  GetBasicGeolocationResponse,
  GetDetailedGeolocationResponse,
  GetGeolocationResponse,
  OpenCageApiResponse,
} from './types';
import pick from 'lodash.pick';

@Injectable()
export class GeolocationService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Given a latitude and longitude, returns geolocation data.
   * Depending on the value of `level`, returns either a basic or detailed response.
   * If `level` is not provided, defaults to 'basic'.
   *
   * @param {number} lat - The latitude of the location.
   * @param {number} lng - The longitude of the location.
   * @param {Level} level - The level of detail in the response. One of 'basic' or 'detailed'.
   * @returns {Promise<GetGeolocationResponse<Level>>} - A promise that resolves with the geolocation data.
   */
  async getGeolocationByCoords<Level extends 'basic' | 'detailed' = 'basic'>(
    lat: number,
    lng: number,
    level?: Level,
  ): Promise<GetGeolocationResponse<Level>> {
    const levelToUse = level || 'basic';

    const q = `${lat},${lng}`;

    const { data } = await lastValueFrom(
      this.httpService.get<OpenCageApiResponse>('', {
        params: {
          q,
        },
      }),
    );

    if (data.status.code === 200 && data.results.length > 0) {
      const { components } = data.results[0];

      const fieldsToBasicPick = pick(components, ['city', 'city_district']);

      const basicResponse: GetBasicGeolocationResponse = {
        ...fieldsToBasicPick,
        formatted: Object.values(fieldsToBasicPick).join(', '),
      };

      if (levelToUse === 'basic') {
        return basicResponse;
      }

      const fieldsToDetailedPick = pick(components, ['road', 'state', 'city', 'city_district']);

      const detailedResponse: GetDetailedGeolocationResponse = {
        ...fieldsToDetailedPick,
        formatted: Object.values(fieldsToDetailedPick).join(', '),
      };

      return detailedResponse;
    } else {
      throw new Error(data.status.message);
    }
  }
}
