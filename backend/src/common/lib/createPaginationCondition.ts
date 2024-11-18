import { PaginationQueriesDto } from '../dto';

type PaginationCodition = {
  take: number;
  skip: number;
  cursor?: { id: string };
};

/**
 * Creates a Prisma pagination condition object from a PaginationQueriesDto.
 *
 * @param pagination - An object containing pagination queries
 * @returns A Prisma pagination condition object
 */
export const createPaginationCondition = (pagination: PaginationQueriesDto): PaginationCodition => {
  const { limit, cursor } = pagination;

  const paginationCondition: PaginationCodition = {
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
  };

  return paginationCondition;
};
