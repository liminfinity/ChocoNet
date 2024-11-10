import { Prisma } from '@prisma/client';
import { GetPastryQueriesDto } from '../dto';
import { getBoundsOfDistance } from 'geolib';
import { kmToMeters } from '@/common/lib';

/**
 * Creates a Prisma where condition object for pastry queries
 *
 * @param search - search query
 * @param categories - list of categories
 * @param price - price queries
 * @param geolocation - geolocation queries
 * @returns Prisma.PastryWhereInput
 */
export const createPastryWhereCondition = ({
  search,
  categories,
  price,
  geolocation,
}: Pick<
  GetPastryQueriesDto,
  'search' | 'categories' | 'price' | 'geolocation'
>): Prisma.PastryWhereInput => {
  const where: Prisma.PastryWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (categories && categories.length > 0) {
    where.categories = {
      some: {
        category: {
          in: categories,
        },
      },
    };
  }

  if (price) {
    where.price = {
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

    where.geolocation = geolocationCondition;
  }

  return where;
};
