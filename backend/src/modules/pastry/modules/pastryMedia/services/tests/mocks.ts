import { faker } from '@faker-js/faker';
import { FindPastryMediaByIdsResponse } from '../../types';

export const mockMediaIds = Array.from({ length: 3 }, () => faker.string.uuid());

export const mockRepositoryPastryMedia: FindPastryMediaByIdsResponse = [
  {
    id: faker.string.uuid(),
    filename: faker.image.url(),
  },
];

export const mockPastryId = faker.string.uuid();
