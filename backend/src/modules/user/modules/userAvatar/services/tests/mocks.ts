import { faker } from '@faker-js/faker';
import { FindUserAvatarByIdsResponse, FindUserAvatarByUserIdResponse } from '../../types';

export const mockUserIds = Array.from({ length: 3 }, () => faker.string.uuid());

export const mockUserAvatarsByIds: FindUserAvatarByIdsResponse = [
  {
    id: faker.string.uuid(),
    filename: faker.image.url(),
  },
];

export const mockUserAvatarByUserId: FindUserAvatarByUserIdResponse = [
  {
    id: faker.string.uuid(),
    filename: faker.image.url(),
  },
];

export const mockUserId = faker.string.uuid();
