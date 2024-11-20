import { GeolocationService } from '@/common/modules';
import { PastryGeolocationDto } from '../dto/geolocation.dto';
import { GetPastryItemResponse } from '../repositories/types';
import { PastryMediaServiceResponse } from '../services/types';

type PastriesParam = Omit<GetPastryItemResponse, 'media'> & { media: PastryMediaServiceResponse[] };

/**
 * Given an array of pastries and a function to get a geolocation response,
 * returns a promise that resolves with an array of pastries with geolocation
 * formatted as a string.
 *
 * @param pastries - An array of pastries without geolocation information.
 * @param getGeolocationByCoords - A function that takes a latitude, longitude,
 * and level, and returns a promise that resolves with a geolocation response.
 *
 * @returns A promise that resolves with an array of pastries with a
 * `geolocation` property that is an object with a `formatted` property.
 */
export const addGeolocationToPastries = (
  pastries: PastriesParam[],
  getGeolocationByCoords: GeolocationService['getGeolocationByCoords'],
): Promise<
  (Omit<PastriesParam, 'geolocation'> & {
    geolocation: (PastryGeolocationDto & { formatted: string }) | null;
  })[]
> => {
  return Promise.all(
    pastries.map(async ({ geolocation, ...pastry }) => {
      if (!geolocation) {
        return {
          ...pastry,
          geolocation: null,
        };
      }
      const { lat, lng } = geolocation;
      const { formatted } = await getGeolocationByCoords(lat, lng);
      return {
        ...pastry,
        geolocation: {
          lat,
          lng,
          formatted,
        },
      };
    }),
  );
};
