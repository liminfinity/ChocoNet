import { GetPastryItemResponse } from "../repositories/types";
import { PastryMediaServiceResponse } from "../services/types";
import { mapPastryMediaToPaths } from "./mapPastryMediaToPaths";

/**
 * Adds media paths to an array of pastries.
 *
 * @param pastries - An array of pastries with media information.
 * @returns An array of pastries with media paths added to each pastry.
 */
export const addMediaPathsToPastries = (pastries: GetPastryItemResponse[]): (Omit<GetPastryItemResponse, 'media'> & { media: PastryMediaServiceResponse[] })[] => {
  return pastries.map((pastry) => ({
    ...pastry,
    media: mapPastryMediaToPaths(pastry.media),
  }));
}
