import { PastryCategory, PastryCategoryEnum } from '@prisma/client';

/**
 * Maps an array of PastryCategoryEnum values to an array of objects,
 * each containing a single 'category' field.
 *
 * @param categories - The array of PastryCategoryEnum values to map.
 * @returns An array of objects with a 'category' field for each input category.
 */
export const mapCategoriesToObjectArray = (
  categories: PastryCategoryEnum[],
): Pick<PastryCategory, 'category'>[] => {
  return categories.map((category) => ({ category }));
};
