import { faker } from '@faker-js/faker';
import { JwtPayload, SaveRefreshTokenRequest, UpdateRefreshTokenRequest } from '../../types';

export const mockRefreshTokenRequest: SaveRefreshTokenRequest = {
  userId: faker.string.uuid(),
  token: faker.string.uuid(),
};

export const mockUpdateRefreshTokenRequest: UpdateRefreshTokenRequest = {
  oldToken: faker.string.uuid(),
  newToken: faker.string.uuid(),
};

export const mockPayload: JwtPayload = {
  sub: faker.string.uuid(),
  email: faker.internet.email(),
};
