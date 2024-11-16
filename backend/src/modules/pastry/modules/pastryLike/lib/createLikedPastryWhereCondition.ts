import { Prisma } from '@prisma/client';

/**
 * Creates a Prisma where condition object that filters pastries to only those
 * that have been liked by the given user.
 *
 * @param userId - The ID of the user whose likes to filter by.
 * @param where - An optional existing where condition object to merge with.
 * @returns A Prisma where condition object that filters pastries by the given user's likes.
 */
export const createLikedPastryWhereCondition = (
  userId: string,
  where?: Prisma.PastryWhereInput,
): Prisma.PastryWhereInput => {
  return {
    ...where,
    likes: {
      some: {
        userId,
      },
    },
  };
};
