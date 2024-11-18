import { Prisma } from '@prisma/client';
import { GetFollowQueriesDto } from '../dto';
import { parseNameParts } from './parseNameParts';

/**
 * Creates a Prisma where condition object for user follow queries
 *
 * @param followType - The type of follow relationship to filter by
 * @param name - The name to search for
 * @returns A Prisma.UserFollowWhereInput object that filters by the given follow type and name
 */
export const createFollowWhereCondition = ({
  followType,
  name,
}: Pick<GetFollowQueriesDto, 'followType' | 'name'>): Prisma.UserFollowWhereInput => {
  const where: Prisma.UserFollowWhereInput = {};

  const nameParts = parseNameParts(name);

  if (nameParts.length === 0) {
    return where;
  }

  where[followType] = {
    OR: nameParts.map((namePart) => ({
      OR: [
        {
          firstName: {
            contains: namePart,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: namePart,
            mode: 'insensitive',
          },
        },
        {
          nickname: {
            contains: namePart,
            mode: 'insensitive',
          },
        },
      ],
    })),
  };

  return where;
};
