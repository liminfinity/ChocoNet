import { Prisma } from '@prisma/client';
import { GetFollowQueriesDto } from '../dto';

/**
 * Creates a Prisma orderBy condition object for user follow queries.
 *
 * @param orderBy - The column to order by
 * @param order - The order to sort by
 * @returns Prisma.UserFollowOrderByWithRelationInput
 */
export const createFollowOrderByCondition = ({
  orderBy,
  order,
}: Pick<GetFollowQueriesDto, 'orderBy' | 'order'>): Prisma.UserFollowOrderByWithRelationInput => {
  const orderByCondition: Prisma.UserFollowOrderByWithRelationInput = {
    [orderBy]: order,
  };
  return orderByCondition;
};
