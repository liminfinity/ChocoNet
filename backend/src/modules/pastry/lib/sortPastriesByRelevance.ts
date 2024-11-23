import { parseNameParts } from '@/modules/user/modules/userFollow/lib';
import { GetSimilarPastriesResponse, PastryForGettingSimilar } from '../repositories/types';

/**
 * Sorts the similar pastries by relevance, so the most relevant ones
 * (with the same category and name parts) are first.
 *
 * @param {GetSimilarPastriesResponse} similarPastries - The similar pastries response.
 * @param {Omit<PastryForGettingSimilar, 'id'>} pastry - The pastry object without the `id` field.
 * @returns {GetSimilarPastriesResponse} The sorted similar pastries response.
 */
export const sortPastriesByRelevance = (
  similarPastries: GetSimilarPastriesResponse,
  { categories, name }: Omit<PastryForGettingSimilar, 'id'>,
): GetSimilarPastriesResponse => {
  const pastryNameParts = parseNameParts(name);

  return similarPastries.sort((a, b) => {
    const aHasCategory = a.categories.some((category) => categories.includes(category));
    const bHasCategory = b.categories.some((category) => categories.includes(category));
    const aHasName = pastryNameParts.some((part) => a.name.toLowerCase().includes(part));
    const bHasName = pastryNameParts.some((part) => b.name.toLowerCase().includes(part));

    // Сортируем по приоритету: сначала с похожими категориями и названием
    if (aHasCategory && aHasName && !(bHasCategory && bHasName)) {
      return -1; // a впереди
    }
    if (!(aHasCategory && aHasName) && bHasCategory && bHasName) {
      return 1; // b впереди
    }
    // Если оба имеют или не имеют похожие категории и название, то проверяем только категории
    if (aHasCategory && !bHasCategory) {
      return -1;
    }
    if (!aHasCategory && bHasCategory) {
      return 1;
    }

    // Если категорий одинаково, то сортируем по названию
    if (aHasName && !bHasName) {
      return -1;
    }
    if (!aHasName && bHasName) {
      return 1;
    }

    return 0; // Если ничего не различается, оставляем как есть
  });
};
