import { Prisma } from '@prisma/client';
import { GetPastryQueriesDto } from '../dto';
import { createPastryWhereCondition } from './createPastryWhereCondition';
import pick from 'lodash.pick';
import { createPastryOrderByCondition } from './createPastryOrderByCondition';

/**
 * Creates a Prisma query object for fetching pastries.
 *
 * @param pagination - Pagination details including limit and cursor
 * @param query - Query parameters from GetPastryQueriesDto, excluding pagination
 * @returns Prisma.PastryFindManyArgs - Object containing query conditions for fetching pastries
 */
export const createPastryQuery = ({
  pagination,
  ...query
}: GetPastryQueriesDto): Prisma.PastryFindManyArgs => {
  const where = createPastryWhereCondition(
    pick(query, ['search', 'categories', 'price', 'geolocation']),
  );

  const orderBy = createPastryOrderByCondition(pick(query, ['orderBy', 'order']));

  const queryCondition: Prisma.PastryFindManyArgs = {
    where,
    orderBy,
  };

  if (pagination) {
    const { limit, cursor } = pagination;

    queryCondition.take = limit;
    queryCondition.skip = cursor ? 1 : 0;

    if (cursor) {
      queryCondition.cursor = {
        id: cursor,
      };
    }
  }

  return queryCondition;
};
