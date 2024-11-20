import { Prisma } from '@prisma/client';
import { GetSimilarPastryQueriesDto } from '../dto';
import { getBoundsOfDistance } from 'geolib';
import { kmToMeters } from '@/common/lib';
import { PastryForGettingSimilar } from '../repositories/types';
import { parseNameParts } from '@/modules/user/modules/userFollow/lib/parseNameParts';

/**
 * Creates a Prisma where condition object for finding similar pastries.
 *
 * @param {GetSimilarPastryQueriesDto} query - The query parameters.
 * @param {PastryForGettingSimilar} pastry - The pastry object from which to get similar pastries.
 * @returns {Prisma.PastryWhereInput} The Prisma where condition object.
 */
export const createSimilarPastryWhereCondition = (
  {
    search,
    categories,
    price,
    geolocation,
  }: Pick<GetSimilarPastryQueriesDto, 'search' | 'categories' | 'price' | 'geolocation'>,
  pastry: PastryForGettingSimilar,
): Prisma.PastryWhereInput => {
  const mainWhere: Prisma.PastryWhereInput = {};

  const pastryWhere: Prisma.PastryWhereInput = {};

  const nameParts = parseNameParts(pastry.name);

  const nameConditions: Prisma.PastryWhereInput[] = nameParts.map((namePart) => ({
    name: {
      contains: namePart,
      mode: 'insensitive',
    },
  }));

  pastryWhere.OR = [
    ...nameConditions,
    {
      categories: {
        some: {
          category: {
            in: pastry.categories,
          },
        },
      },
    },
  ];

  const queryWhere: Prisma.PastryWhereInput = {};

  if (search) {
    queryWhere.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (categories && categories.length > 0) {
    queryWhere.categories = {
      some: {
        category: {
          in: categories,
        },
      },
    };
  }

  if (price) {
    queryWhere.price = {
      gte: price.min,
      lte: price?.max,
    };
  }

  if (geolocation) {
    const { lat, lng, radius } = geolocation;

    const [min, max] = getBoundsOfDistance(
      {
        lat,
        lng,
      },
      kmToMeters(radius),
    );

    const geolocationCondition: Prisma.PastryWhereInput['geolocation'] = {
      lat: {
        gte: min.latitude,
        lte: max.latitude,
      },
      lng: {
        gte: min.longitude,
        lte: max.longitude,
      },
    };

    queryWhere.geolocation = geolocationCondition;
  }

  mainWhere.AND = [pastryWhere, queryWhere, { id: { not: pastry.id } }];

  return mainWhere;
};
