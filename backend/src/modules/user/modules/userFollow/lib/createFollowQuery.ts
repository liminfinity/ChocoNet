import { Prisma } from '@prisma/client';
import { GetFollowQueriesDto } from '../dto';
import pick from 'lodash.pick';
import { createFollowWhereCondition } from './createFollowWhereCondition';
import { createFollowOrderByCondition } from './createFollowOrderByCondition';
import { createPaginationCondition } from '@/common/lib';

/**
 * Creates a Prisma query object for fetching user follows.
 *
 * @param pagination - Pagination details including limit and cursor
 * @param query - Query parameters from GetFollowQueriesDto, excluding pagination
 * @returns Prisma.UserFollowFindManyArgs - Object containing query conditions for fetching user follows
 */
export const createFollowQuery = (
  { pagination, ...query }: GetFollowQueriesDto
): Prisma.UserFollowFindManyArgs => {
  const where = createFollowWhereCondition(pick(query, ['followType', 'name']));

  const orderBy = createFollowOrderByCondition(pick(query, ['orderBy', 'order']));

  const queryCondition: Prisma.UserFollowFindManyArgs = {
    where,
    orderBy,
    ...createPaginationCondition(pagination),
  };

  return queryCondition;
};
