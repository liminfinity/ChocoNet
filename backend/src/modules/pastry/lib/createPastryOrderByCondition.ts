import { Prisma } from '@prisma/client';
import { GetPastryQueriesDto } from '../dto';

/**
 * Creates a Prisma orderBy condition object for pastry queries
 *
 * @param orderBy - The column to order by
 * @param order - The order to sort by
 * @returns Prisma.PastryOrderByWithRelationInput
 */
export const createPastryOrderByCondition = ({
  orderBy,
  order,
}: Pick<GetPastryQueriesDto, 'orderBy' | 'order'>): Prisma.PastryOrderByWithRelationInput => {
  const orderByCondition: Prisma.PastryOrderByWithRelationInput = {};

  switch (orderBy) {
    case 'popularity': {
      orderByCondition.likes = {
        _count: order,
      };
      break;
    }
    default: {
      orderByCondition[orderBy] = order;
    }
  }

  return orderByCondition;
};
