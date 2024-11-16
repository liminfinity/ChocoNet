import { GeolocationService } from '@/common/modules';
import { PastryGeolocationDto } from '../dto/geolocation';
import { GetPastryItemResponse } from '../repositories/types';
import { PastryMediaServiceResponse } from '../services/types';

type PastriesParam = Omit<GetPastryItemResponse, 'media'> & { media: PastryMediaServiceResponse[] };

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
