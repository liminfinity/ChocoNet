import { Prisma } from '@prisma/client';
import {GetSimilarPastryQueriesDto } from '../dto';
import pick from 'lodash.pick';
import { createPastryOrderByCondition } from './createPastryOrderByCondition';
import { createPaginationCondition } from '@/common/lib';
import { PastryForGettingSimilar } from '../repositories/types';
import { createSimilarPastryWhereCondition } from './createSimilarPastryWhereCondition';

/**
 * Creates a Prisma query object for fetching similar pastries.
 *
 * @param pagination - Pagination details including limit and cursor
 * @param query - Query parameters from GetSimilarPastryQueriesDto, excluding pagination
 * @param pastry - The pastry object from which to get similar pastries
 * @returns Prisma.PastryFindManyArgs - Object containing query conditions for fetching similar pastries
 */
export const createSimilarPastryQuery = (
  { pagination, ...query }: GetSimilarPastryQueriesDto,
  pastry: PastryForGettingSimilar,
): Prisma.PastryFindManyArgs => {
  const where = createSimilarPastryWhereCondition(
    pick(query, ['search', 'categories', 'price', 'geolocation']),
    pastry,
  );

  const orderBy = createPastryOrderByCondition(pick(query, ['orderBy', 'order']));

  const queryCondition: Prisma.PastryFindManyArgs = {
    where,
    orderBy,
    ...createPaginationCondition(pagination),
  };

  return queryCondition;
};
