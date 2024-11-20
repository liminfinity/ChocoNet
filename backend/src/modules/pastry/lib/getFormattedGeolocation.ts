import { GeolocationService } from '@/common/modules';
import { PastryGeolocationDto } from '../dto/geolocation.dto';

/**
 * Asynchronously formats the geolocation data by adding a detailed formatted address.
 *
 * @param {PastryGeolocationDto | null} geolocation - The geolocation data containing latitude and longitude, or null.
 * @param {GeolocationService['getGeolocationByCoords']} getGeolocationByCoords - A function to fetch formatted geolocation data using coordinates.
 * @returns {Promise<(PastryGeolocationDto & { formatted: string }) | null>} - A promise that resolves to the geolocation data with a formatted address, or null if the input geolocation is null.
 */
export const getFormattedGeolocation = async (
  geolocation: PastryGeolocationDto | null,
  getGeolocationByCoords: GeolocationService['getGeolocationByCoords'],
): Promise<(PastryGeolocationDto & { formatted: string }) | null> => {
  if (!geolocation) return null;
  const { formatted } = await getGeolocationByCoords(geolocation.lat, geolocation.lng, 'detailed');
  return { ...geolocation, formatted };
};
